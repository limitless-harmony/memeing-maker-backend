import uuidv4 from 'uuid/v4';
import aws from 'aws-sdk';
import ApplicationError from '../helpers/Error';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
} = process.env;

aws.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

// eslint-disable-next-line consistent-return
const saveImage = async (req, res, next) => {
  const { data } = req;
  const { image } = data;
  const S3 = new aws.S3();
  const key = uuidv4();
  if (!image || !image.includes('data:image/png;base64')) return next();

  const buf = Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: buf,
    ContentType: 'image/png',
    ACL: 'public-read',
  };

  S3.upload(params, (err, response) => {
    if (err) throw new ApplicationError(err.message, 500);
    data.image = response.Location;
    req.data = data;
    return next();
  });
};

export default saveImage;
