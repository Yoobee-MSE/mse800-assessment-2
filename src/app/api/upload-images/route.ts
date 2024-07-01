// /src/app/api/upload-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import AWS, { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (file: formidable.File): Promise<string> => {
  const fileContent = fs.readFileSync(file.filepath);
  const fileExtension = file.originalFilename?.split('.').pop();
  const newFilename = `${uuidv4()}.${fileExtension}`;
  const params: S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: 'test-files/' + newFilename,
    Body: fileContent,
    ContentType: file.mimetype as string,
    // ACL: 'public-read',
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  // form.uploadDir = '/tmp';
  // form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload error' });
    }

    // const folderName = fields?.folderName as string;

    try {
      const uploadedFiles = await Promise.all(
        Object.values(files).map(file => uploadFileToS3(file as formidable.File))
      );

      return res.status(200).json({ urls: uploadedFiles });
    } catch (error) {
      console.error('🚀 ~ handler ~ error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}