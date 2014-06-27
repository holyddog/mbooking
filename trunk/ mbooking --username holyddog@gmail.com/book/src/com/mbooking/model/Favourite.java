package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "favs")
public class Favourite {
	@Id
	ObjectId fid;
	Long bid;
	Long uid;
	Long fdate;
	
	public ObjectId getFid() {
		return fid;
	}
	public void setFid(ObjectId fid) {
		this.fid = fid;
	}
	public Long getBid() {
		return bid;
	}
	public void setBid(Long bid) {
		this.bid = bid;
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
}
