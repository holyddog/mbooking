package com.mbooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "follows")
public class Follow {
	@Id
	Long fid;
	Long auid;	//Author ID
	Long uid;	//Follower ID
	User auth ;//Author
	User foll;//Follower
	
	public Long getFid() {
		return fid;
	}
	public void setFid(Long fid) {
		this.fid = fid;
	}
	public Long getAuid() {
		return auid;
	}
	public void setAuid(Long auid) {
		this.auid = auid;
	}
	public Long getUid() {
		return uid;
	}
	public void setUid(Long uid) {
		this.uid = uid;
	}
	public User getAuth() {
		return auth;
	}
	public void setAuth(User auth) {
		this.auth = auth;
	}
	public User getFoll() {
		return foll;
	}
	public void setFoll(User foll) {
		this.foll = foll;
	}

	
}
