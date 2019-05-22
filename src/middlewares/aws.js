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
const saveImage = async (req, res, next) => {
  const { meme } = req;
  const { image } = meme;
  const S3 = new aws.S3();
  const name = meme.name || uuidv4();
  if (!image || !image.includes('data:image/png;base64')) {
    meme.name = name;
    req.meme = meme;
    next();
  } else {
    const buf = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: name,
      Body: buf,
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    S3.upload(params, (err, data) => {
      if (err) throw new ApplicationError(err.message, 500, err);
      meme.image = data.Location;
      meme.name = data.key;
      req.meme = meme;
      next();
    });
  }
};

export default saveImage;
