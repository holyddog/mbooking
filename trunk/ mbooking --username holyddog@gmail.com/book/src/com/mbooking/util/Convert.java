package com.mbooking.util;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Convert {	
	public static String getExt(String fileName) {
		if (fileName == null) {
			return "";
		}
		return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length());
	}
	
	public static String toString(Object obj) {
		if (obj != null) {
			try {
				return new String(String.valueOf(obj).getBytes("ISO-8859-1"), "UTF-8");
			} 
			catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		return null;
	}
	
	public static String toMD5Password(String inputPwd) {
	    MessageDigest algorithm = null;
	    
	    try {
	    	algorithm = MessageDigest.getInstance("MD5");
	    }
	    catch (NoSuchAlgorithmException ex) {
	        return null;
	    }
	    
        byte[] defaultBytes = inputPwd.getBytes();
        algorithm.reset();
        algorithm.update(defaultBytes);
        
        byte messageDigest[] = algorithm.digest();        
        StringBuffer hexString = new StringBuffer();
        
        for (int i = 0; i < messageDigest.length; i++) {
            String hex = Integer.toHexString(0xFF & messageDigest[i]);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
		return hexString.toString();
	}
	
	public static String getStrTime(String fileName) {
		
		return "";
	}
	
}
