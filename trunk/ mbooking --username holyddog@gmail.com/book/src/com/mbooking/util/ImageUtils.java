package com.mbooking.util;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

public class ImageUtils {
	public static boolean crop(File input, File output) {
		try {
			BufferedImage src = ImageIO.read(input);
			int imageWidth = ((Image)src).getWidth(null);
			int imageHeight = ((Image)src).getHeight(null);
			
			int size, x, y;			
			if (imageWidth > imageHeight) {
				size = imageHeight;
				y = 0;
				x = (imageWidth / 2) - (size / 2);
			}
			else {
				size = imageWidth;
				x = 0;
				y = (imageHeight / 2) - (size / 2);
			}
			
		    BufferedImage dest = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
		    Graphics g = dest.getGraphics();
		    g.drawImage(src, 0, 0, size, size, x, y, x + size, y + size, null);
		    g.dispose();
		    
		    boolean success = ImageIO.write(dest, Convert.getExt(input.getName()), output);
		    
		    src.flush();
		    dest.flush();
		    
		    return success;
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
	    return false;
	}
	
	public static boolean resize(File input, File output, int maxWidth, int maxHeight) { 
		 try {		
			 if (!input.exists()) {
				 return false;
			 } 
			 
			 BufferedImage buff = ImageIO.read(input);
			
			 double thumbRatio = (double)maxWidth / (double)maxHeight;
			 int imageWidth = ((Image)buff).getWidth(null);
			 int imageHeight = ((Image)buff).getHeight(null);
			 double imageRatio = (double)imageWidth / (double)imageHeight;
			 
			 if (imageWidth > maxWidth || imageHeight > maxHeight) {			
				 if (thumbRatio < imageRatio)
					 maxHeight = (int)(maxWidth / imageRatio);
				 else
					 maxWidth = (int)(maxHeight * imageRatio);
			 }
			 else {
				 maxWidth = imageWidth;
				 maxHeight = imageHeight;
			 }
			
			 Image image = buff.getScaledInstance(maxWidth, maxHeight, 72);
			 BufferedImage newBuff = new BufferedImage(image.getWidth(null), image.getHeight(null), BufferedImage.TYPE_INT_RGB);
			 Graphics g = newBuff.getGraphics();
			 g.drawImage(image, 0, 0, null);
			 g.dispose();
			
			 boolean success = ImageIO.write(newBuff, Convert.getExt(output.getName()), output);
			
			 buff.flush();
			 newBuff.flush();
			 
			 return success;
		 }
		 catch (IOException ex) {
			 ex.printStackTrace();
		 }
		 return false;
	}
}
