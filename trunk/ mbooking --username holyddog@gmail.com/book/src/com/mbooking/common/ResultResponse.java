package com.mbooking.common;

import java.util.HashMap;

public class ResultResponse {
	public static HashMap<String, Object> getResult(String key, Object value) {		
		HashMap<String, Object> result = new HashMap<String, Object>(); 
		result.put(key, value);
		return result;
	}
}
