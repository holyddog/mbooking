package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes")
public class Like {
	@Id
	ObjectId lid;
	Long bid;
	Long uid;
	Long ldate;

	public ObjectId getLid() {
		return lid;
	}

	public void setLid(ObjectId lid) {
		this.lid = lid;
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

	public Long getLdate() {
		return ldate;
	}

	public void setLdate(Long ldate) {
		this.ldate = ldate;
	}
}
