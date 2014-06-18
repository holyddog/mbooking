package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "views")
public class View {
	@Id
	ObjectId vid;

	@Indexed
	Long uid;
	@Indexed
	Long bid;
	Integer count; // view count
	Long ldate; // last view date

	public ObjectId getVid() {
		return vid;
	}

	public void setVid(ObjectId vid) {
		this.vid = vid;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public Long getLdate() {
		return ldate;
	}

	public void setLdate(Long ldate) {
		this.ldate = ldate;
	}
}
