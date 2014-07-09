package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "follows")
public class Follow {
	@Id
	ObjectId fid;
	Long auid; // Author ID
	Long uid;  // Follower ID
//	User auth; // Author
//	User foll; // Follower
	Long fdate;
	
	User user;
	Boolean acptnot;

	public ObjectId getFid() {
		return fid;
	}

	public void setFid(ObjectId fid) {
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

	public Long getFdate() {
		return fdate;
	}

	public void setFdate(Long fdate) {
		this.fdate = fdate;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}	
	
	public Boolean getAcptnot() {
		return acptnot;
	}

	public void setAcptnot(Boolean acptnot) {
		this.acptnot = acptnot;
	}

}
