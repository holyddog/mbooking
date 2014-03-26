package com.mbooking.util;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;

import com.mbooking.constant.ConstValue;

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
	
	public static boolean cropAndResize(File input, File output, int maxWidth, int maxHeight) {
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
			
			
			 //Crop distance
			int size, x, y;			
			if (maxWidth > maxHeight) {
				size = maxHeight;
				y = 0;
				x = (maxWidth / 2) - (size / 2);
			}
			else {
				size = maxWidth;
				x = 0;
				y = (maxHeight / 2) - (size / 2);
			}
			
			Image image = buff.getScaledInstance(maxWidth, maxHeight, 72);
			
			
		    BufferedImage dest = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
		    Graphics g = dest.getGraphics();
		    g.drawImage(image, 0, 0, size, size, x, y, x + size, y + size, null);
		    g.dispose();
		    
		    boolean success = ImageIO.write(dest, Convert.getExt(input.getName()), output);
		    
		    image.flush();
		    dest.flush();
		    
		    return success;
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
	    return false;
	}
	
	
	public static boolean isEmpty(String str) {
		if (str != null && str.trim().length() > 0) {
			return false;
		}
		return true;
	}
	
	public static String uniqueString(int length) {
		String randChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ012345678901234567890123456789";
		Random rand = new Random();
	    char[] text = new char[length];
	    for (int i = 0; i < length; i++) {
	        text[i] = randChars.charAt(rand.nextInt(randChars.length()));
	    }
	    return new String(text);
	}
	
	
	public static String toImageFile(String image_folder,String base64) {
		return toImageFile(image_folder,base64, false);
	}
	
	
	public static String toImageFile(String image_folder,String base64, boolean crop) {
		if (isEmpty(base64)) {
			return null;
		}
		String uploadPath = InitParam.getParam("upload")+"/"+image_folder;
		
		String key = uniqueString(8);
		String image = key + ".jpg";
		byte[] b = new Base64().decode(base64.getBytes());
		
		
		try {
			File file = new File(uploadPath + "/" + image);
			FileOutputStream output = new FileOutputStream(file);  
			output.write(b);  
			output.flush();  
			output.close();

			if (crop) {
				
				Integer n_size = ConstValue.NORMAL_SIZE;
				File normalSizeFile = new File(uploadPath + "/" + key + "_n.jpg");
				ImageUtils.cropAndResize(file, normalSizeFile, n_size, n_size);
				
				Integer l_size = ConstValue.LARGE_SIZE;
				File LargeSizeFile = new File(uploadPath + "/" + key + "_l.jpg");
				ImageUtils.cropAndResize(file, LargeSizeFile, l_size, l_size);
				
				Integer xl_size = ConstValue.EXTRA_LARGE_SIZE;
				File XLargeSizeFile = new File(uploadPath + "/" + key + "_xl.jpg");
				ImageUtils.cropAndResize(file, XLargeSizeFile, xl_size, xl_size);
				
			}
			
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		return "/"+image_folder+"/" + image;
	}
	
}
