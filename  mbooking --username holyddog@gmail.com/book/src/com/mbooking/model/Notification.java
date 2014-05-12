package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notices")
public class Notification {

	@Id
	ObjectId _id;
	
	Long uid;	
	Integer ntype;	// 1 = new follower, 2 = new comment on my book	
	String message;
	Long adate;	// alert date
	
	Book book; // book reference
	User who; // user reference (who notified)
	Boolean unread;

	// pretty time
	String time;
	
	public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public Integer getNtype() {
		return ntype;
	}

	public void setNtype(Integer ntype) {
		this.ntype = ntype;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Long getAdate() {
		return adate;
	}

	public void setAdate(Long adate) {
		this.adate = adate;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public User getWho() {
		return who;
	}

	public void setWho(User who) {
		this.who = who;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public Boolean getUnread() {
		return unread;
	}

	public void setUnread(Boolean unread) {
		this.unread = unread;
	}
}
