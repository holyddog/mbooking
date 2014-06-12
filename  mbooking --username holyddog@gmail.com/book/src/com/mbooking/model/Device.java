package com.mbooking.model;

import org.springframework.data.mongodb.core.index.Indexed;

public class Device {

	@Indexed(unique = true)
	String token;
	Integer os;		//1 iOS,2 Android
	
	String alias;	//Username || Email
	String[] tags;
	
	Long lstuse;	//last use
	
	public Integer getOs() {
		return os;
	}
	public void setOs(Integer os) {
		this.os = os;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String[] getTags() {
		return tags;
	}
	public void setTags(String[] tags) {
		this.tags = tags;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public Long getLstuse() {
		return lstuse;
	}
	public void setLstuse(Long lstuse) {
		this.lstuse = lstuse;
	}

}
