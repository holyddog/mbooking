package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reports")
public class Report {
	@Id
	ObjectId rid;
	
	// 1 = Nudity or pornography
	// 2 = Attacks a group or individual
	// 3 = Graphic violence
	// 4 = Spam
	// 5 = Copyright & trademark
	// 6 = Hateful speech or symbols
	// 7 = Other...
	Integer type;
	
	String msg;
	Long bid;
	Long uid;
	Long rdate;
	
//	Nudity or pornography
//	Attacks a group or individual
//	Graphic violence
//	Spam
//	Copyright & trademark
//	Hateful speech or symbols
//	Other...
//
//	Story reported

	public ObjectId getRid() {
		return rid;
	}

	public void setRid(ObjectId rid) {
		this.rid = rid;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
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

	public Long getRdate() {
		return rdate;
	}

	public void setRdate(Long rdate) {
		this.rdate = rdate;
	}
}
