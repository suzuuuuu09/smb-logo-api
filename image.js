// image.js
const { createCanvas, registerFont, loadImage } = require('canvas');
const path = require('path');
const { Font } = require('./font');

class ImageCreator {
  constructor(fontPath, fontFamily, leftImagePath, centerImagePath, rightImagePath) {
    this.fontPath = fontPath;
    this.fontFamily = fontFamily;
    this.leftImagePath = leftImagePath;
    this.centerImagePath = centerImagePath;
    this.rightImagePath = rightImagePath;

    const font = new Font(fontPath, fontFamily);
    font.register();
  }

  async createImage(top, bottom, isShade) {
    const lowerTop = top.toLowerCase();
    const upperBottom = bottom.toUpperCase();

    try {
      const [leftImage, centerImage, rightImage] = await Promise.all([
        loadImage(this.leftImagePath),
        loadImage(this.centerImagePath),
        loadImage(this.rightImagePath)
      ]);

      const tempCanvas = createCanvas(0, 0);
      const tempCtx = tempCanvas.getContext('2d');
      const fontSize = 240;
      tempCtx.font = `${fontSize}px "${this.fontFamily}"`;
      
      const topTextWidth = tempCtx.measureText(lowerTop).width;
      const bottomTextWidth = tempCtx.measureText(upperBottom).width;    

      const canvasWidth = (((Math.max(topTextWidth, bottomTextWidth) + 100) / 36) >> 0) * 36;
      const canvasHeight = Math.max(leftImage.height, centerImage.height, rightImage.height);

      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');

      const repeatCount = canvasWidth / 36 - 2;

      let xOffset = 0;
      ctx.drawImage(leftImage, xOffset, 0, leftImage.width, leftImage.height);
      xOffset += leftImage.width;

      for (let i = 0; i < repeatCount; i++) {
        ctx.drawImage(centerImage, xOffset, 0, centerImage.width, centerImage.height);
        xOffset += centerImage.width;
      }

      ctx.drawImage(rightImage, xOffset, 0, rightImage.width, rightImage.height);

      ctx.font = `${fontSize}px "${this.fontFamily}"`;

      const textX = 45;
      const topTextY = fontSize - 52;
      const bottomTextY = topTextY + fontSize + 16;

      if(isShade){
        ctx.fillStyle = '#000000';
        ctx.fillText(lowerTop, textX + 6, topTextY + 12);
        ctx.fillText(upperBottom, textX + 6, bottomTextY + 12);
      }

      ctx.fillStyle = '#ffd3b1';
      ctx.fillText(lowerTop, textX, topTextY);
      ctx.fillText(upperBottom, textX, bottomTextY);

      return canvas.toBuffer('image/png');
    } catch (error) {
      throw new Error(`Error loading images: ${error}`);
    }
  }
}

module.exports = { ImageCreator };