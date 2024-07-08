// index.js
import { ImageCreator } from './image';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const fontPath = path.join(process.cwd(), 'public/fonts/SuperPlumberBrothers.ttf');
const fontFamily = 'Super Plumber Brothers';
const leftImagePath = path.join(process.cwd(), 'public/images/FrameLeft.png');
const centerImagePath = path.join(process.cwd(), 'public/images/FrameCenter.png');
const rightImagePath = path.join(process.cwd(), 'public/images/FrameRight.png');

const imageCreator = new ImageCreator(fontPath, fontFamily, leftImagePath, centerImagePath, rightImagePath);

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  const { top, bottom, shade } = req.query;

  if (!top || !bottom) {
    return res.status(400).send('top and bottom text query parameters are required');
  }

  const isShade = shade !== 'false';

  try {
    const imageBuffer = await imageCreator.createImage(top, bottom, isShade);
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).send('Failed to create image');
  }
}