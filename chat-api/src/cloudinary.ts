import cloudinary from "cloudinary";
import { Request, Response, NextFunction } from "express";

export const cloudinaryV = cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true,
});

export const presignedURL = (req: any, res: Response, next: NextFunction) => {
  const timestamp: number = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp: timestamp,
  };
  const signature = cloudinary.v2.utils.api_sign_request(
    params,
    process.env.CLOUDINARYSECRET as string
  );
  res.json({ timestamp, signature });
};
