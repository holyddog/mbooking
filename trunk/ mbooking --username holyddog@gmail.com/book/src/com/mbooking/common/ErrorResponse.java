package com.mbooking.common;

import java.util.HashMap;

public class ErrorResponse {
	String message;
	String type;
	Integer code;
	
	public static HashMap<String, ErrorResponse> getError(String message) {		
		HashMap<String, ErrorResponse> error = new HashMap<String, ErrorResponse>(); 
		error.put("error", new ErrorResponse(message));
		return error;
	}

	public ErrorResponse(String message) {
		super();
		this.message = message;
	}

	public ErrorResponse(String message, String type, int code) {
		super();
		this.message = message;
		this.type = type;
		this.code = code;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}
}
