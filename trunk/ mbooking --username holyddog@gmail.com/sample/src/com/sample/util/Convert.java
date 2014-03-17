package com.sample.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Convert {	
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
}
