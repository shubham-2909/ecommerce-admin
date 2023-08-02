// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import multiparty from 'multiparty'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import mime from 'mime-types'

const bucketname = 'shubham-next-ecommerce'
export default async function handler(req, res) {
  const form = new multiparty.Form()
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      resolve({ fields, files })
    })
  })

  const client = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  })
  let links = []
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop()
    const newFileName = `${Date.now()}.${ext}`
    await client.send(
      new PutObjectCommand({
        Bucket: bucketname,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ACL: 'public-read',
        ContentType: mime.lookup(file.path),
      })
    )
    const link = `https://${bucketname}.s3.eu-north-1.amazonaws.com/${newFileName}`
    links.push(link)
  }

  res.status(200).json(links)
}

export const config = {
  api: { bodyParser: false },
}
