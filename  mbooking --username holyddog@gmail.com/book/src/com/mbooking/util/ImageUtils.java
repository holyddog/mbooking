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
			
			 Image image = buff.getScaledInstance(maxWidth, maxHeight,100);
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
	
	public static boolean cropSquareAndResize(File input, File output, int square_size,boolean portrait) {
		try {
				
			int maxWidth=square_size;
			int maxHeight=square_size;
			
			
			 if (!input.exists()) {
				 return false;
			 } 
			 
			 BufferedImage buff = ImageIO.read(input);
			
			 double thumbRatio = 1;
			 int imageWidth = ((Image)buff).getWidth(null);
			 int imageHeight = ((Image)buff).getHeight(null);
			 double imageRatio = (double)imageWidth / (double)imageHeight;
			 
			 if (imageWidth > maxWidth || imageHeight > maxHeight) {			
				 if (thumbRatio > imageRatio)
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
			
			Image image = buff.getScaledInstance(maxWidth, maxHeight,100);
			
			
		    BufferedImage dest = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
		    Graphics g = dest.getGraphics();
		   
		    if(portrait&&y!=0){
		    	g.drawImage(image, 0, 0, size, size, x, y/2, x + size, y/2 + size, null);
		    }
		    else{
		     	g.drawImage(image, 0, 0, size, size, x, y, x + size, y + size, null);
			}
		    
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
	
	
	public static boolean cropSquareAndResizeCustom(File input, String  path_file,String filename) {
		try {
			final int SMALL_SIZE = ConstValue.SMALL_SIZE;
			final int NORMAL_SIZE = ConstValue.NORMAL_SIZE;
			final int LARGE_SIZE = ConstValue.LARGE_SIZE;
			final int EXTRA_LARGE_SIZE = ConstValue.EXTRA_LARGE_SIZE;
			
			final int COVER_HEIGHT_SIZE = ConstValue.COVER_HEIGHT_SIZE;
			final int COVER_WIDTH_SIZE = ConstValue.COVER_WIDTH_SIZE;
			
			String key = filename;
			
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
		    
			BufferedImage crop_img = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
			    Graphics g = crop_img.getGraphics();
			    g.drawImage(src, 0, 0, size, size, x, y, x + size, y + size, null);
			    g.dispose();
			
			Image xlarge_image = crop_img.getScaledInstance(EXTRA_LARGE_SIZE, EXTRA_LARGE_SIZE, 72);
			Image large_image = crop_img.getScaledInstance(LARGE_SIZE, LARGE_SIZE, 72);
			Image normal_image = crop_img.getScaledInstance(NORMAL_SIZE, NORMAL_SIZE, 72);
			Image small_image = crop_img.getScaledInstance(SMALL_SIZE, SMALL_SIZE, 72);
			Image cover_image = crop_img.getScaledInstance(COVER_HEIGHT_SIZE, COVER_HEIGHT_SIZE, 72);
			 
			
			 File xlargeSizeFile = new File(path_file + "/" + key+ "_xl.jpg");
			 BufferedImage xlarge_buff = new BufferedImage(xlarge_image.getWidth(null), xlarge_image.getHeight(null), BufferedImage.TYPE_INT_RGB);
			 Graphics g_xl = xlarge_buff.getGraphics();
			 g_xl.drawImage(xlarge_image, 0, 0, null);
			 g_xl.dispose();
			 boolean success = ImageIO.write(xlarge_buff, Convert.getExt(xlargeSizeFile.getName()), xlargeSizeFile);
			
			 File largeSizeFile = new File(path_file + "/" +key+ "_l.jpg");
			 BufferedImage large_buff = new BufferedImage(large_image.getWidth(null), large_image.getHeight(null), BufferedImage.TYPE_INT_RGB);
			 Graphics g_l = large_buff.getGraphics();
			 g_l.drawImage(large_image, 0, 0, null);
			 g_l.dispose();
			 success = ImageIO.write(large_buff, Convert.getExt(largeSizeFile.getName()), largeSizeFile);
			
			 File normalSizeFile = new File(path_file + "/" + key+ "_n.jpg");
			 BufferedImage normal_buff = new BufferedImage(normal_image.getWidth(null), normal_image.getHeight(null), BufferedImage.TYPE_INT_RGB);
			 Graphics g_n = normal_buff.getGraphics();
			 g_n.drawImage(normal_image, 0, 0, null);
			 g_n.dispose();
			 success = ImageIO.write(normal_buff, Convert.getExt(normalSizeFile.getName()), normalSizeFile);
			 
			 File smallSizeFile = new File(path_file + "/" + key+ "_s.jpg");
			 BufferedImage small_buff = new BufferedImage(small_image.getWidth(null), small_image.getHeight(null), BufferedImage.TYPE_INT_RGB);
			 Graphics g_s = small_buff.getGraphics();
			 g_s.drawImage(small_image, 0, 0, null);
			 g_s.dispose();
			 success = ImageIO.write(small_buff, Convert.getExt(smallSizeFile.getName()), smallSizeFile);
			 
			 int cvheight = COVER_HEIGHT_SIZE;
			 int cvwidth = COVER_WIDTH_SIZE;
			 
			 
			 x = (cvheight / 2) - (cvwidth/ 2);
			 
			 File coverSizeFile = new File(path_file + "/" + key+ "_cv.jpg");
			 BufferedImage cover_buff = new BufferedImage(cvwidth, cvheight, BufferedImage.TYPE_INT_RGB);
			 Graphics g_cv = cover_buff.getGraphics();
			 g_cv.drawImage(cover_image, 0, 0, cvwidth, cvheight, x, 0, x + cvwidth,cvheight, null);
			 g_cv.dispose();
			 success = ImageIO.write(cover_buff, Convert.getExt(coverSizeFile.getName()), coverSizeFile);
			 
			 
			 xlarge_buff.flush();
			 large_buff.flush();
			 normal_buff.flush();
			 cover_buff.flush();
			 
			 crop_img.flush();
			 src.flush();
			
			
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
		return toImageFile(image_folder,base64, ConstValue.NONE_TYPE);
	}
	
	
	public static String toImageFile(String image_folder,String base64, Integer imgtype) {
		if (isEmpty(base64)) {
			return null;
		}
		
		String uploadPath = ConfigReader.getProp("upload_path")+"/"+image_folder;
		
		if(!new File(uploadPath).exists())
		{
			new File(uploadPath).mkdirs();	
		}
		
	
		String key = uniqueString(8);
		String image = key + ".jpg";
		byte[] b = new Base64().decode(base64.getBytes());
		
		
		try {
			File file = new File(uploadPath + "/" + image);
			FileOutputStream output = new FileOutputStream(file);  
			output.write(b);  
			output.flush();  
			output.close();

			if (imgtype==ConstValue.PAGE_IMG_TYPE) {
				
				cropSquareAndResizeCustom(file,uploadPath,key);
			}
			else if(imgtype==ConstValue.PROFILE_IMG_TYPE){
				
				 File profilePicFile = new File(uploadPath + "/" + key+ "_sp.jpg");	// Small Profile Pic	
				
				cropSquareAndResize(file, profilePicFile, ConstValue.PROFILE_SIZE, true);
			}
			
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		return "/"+image_folder+"/" + image;
	}
	
	public static Boolean deleteImageFile(String filename,Integer imgtype){
		
		String path = ConfigReader.getProp("upload_path");
		
		try{
			File file = new File(path+filename);
			
			if(file.delete()){
    			System.out.println(file.getName() + " is deleted!");
    		}else{
    			System.out.println("Delete operation is failed.");
    		}
		}
		catch(Exception e){
			System.out.println( "Can't Delete File "+path+filename+" error:"+ e);
			return false;
		}
		if(imgtype==ConstValue.PAGE_IMG_TYPE){
			
			String small_size_path = path + filename.replace(".jpg","_s.jpg");	
			String normal_size_path = path + filename.replace(".jpg","_n.jpg");	
			String large_size_path = path + filename.replace(".jpg","_l.jpg");	
			String xlarge_size_path = path + filename.replace(".jpg","_xl.jpg");	
			
			try{
				
				File small_size_file = new File(small_size_path);
				File normal_size_file = new File(normal_size_path);
				File large_size_file = new File(large_size_path);
				File xlarge_size_file = new File(xlarge_size_path);
				
				
				if(small_size_file.delete()){
	    			System.out.println(small_size_path + " is deleted!");
	    		}else{
	    			System.out.println("Delete "+small_size_path +" is failed.");
	    		}
				
				if(normal_size_file.delete()){
	    			System.out.println(normal_size_path + " is deleted!");
	    		}else{
	    			System.out.println("Delete "+normal_size_path +" is failed.");
	    		}
				
				if(large_size_file.delete()){
	    			System.out.println(normal_size_path + " is deleted!");
	    		}else{
	    			System.out.println("Delete "+large_size_path +" is failed.");
	    		}
				
				
				if(xlarge_size_file.delete()){
	    			System.out.println(normal_size_path + " is deleted!");
	    		}else{
	    			System.out.println("Delete "+xlarge_size_path +" is failed.");
	    		}
				
			}
			catch(Exception e){
				System.out.println( "Can't delete some of crop image  error:"+ e);
				return false;
			}
		}
		else if(imgtype==ConstValue.PROFILE_IMG_TYPE){
			
			String profile_img_path = path + filename.replace(".jpg","_sp.jpg");	
		
			try{
				
				File profile_img_file = new File(profile_img_path);
			
				if(profile_img_file.delete()){
	    			System.out.println(profile_img_file + " is deleted!");
	    		}else{
	    			System.out.println("Delete "+profile_img_file +" is failed.");
	    		}
				
			}
			catch(Exception e){
				System.out.println( "Can't delete profile image  error:"+ e);
				return false;
			}
		}
		return true;
	}
}