import uuidv4 from 'uuid/v4';
import aws from 'aws-sdk';
import { responseError } from '../helpers';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
} = process.env;
aws.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});
const saveImage = async (req, res, next) => {
  const base64Data = req.body.image;
  const S3 = new aws.S3();
  const name = uuidv4();
  const buf = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: name,
    Body: buf,
    ContentType: 'image/png',
    ACL: 'public-read'
  };
  await S3.upload(params, (err, data) => {
    if (err) return responseError(500, err, err.message, res);
    req.body.image = data.Location;
    req.body.name = data.key;
    next();
  });
};

export default saveImage;
