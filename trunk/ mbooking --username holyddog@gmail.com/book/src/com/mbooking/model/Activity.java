package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "acts")

public class Activity {
	public static final int PUBLISHED = 1;
	public static final int NEW_PAGE = 2;
	public static final int LIKED = 3;
	public static final int FAVOURITE = 4;
	public static final int NEW_FOLLOWING = 5;
	public static final int COMMENTED = 6;
	
	@Id
	ObjectId aid;
	
	@Indexed
	Long uid;	
	User user;
	
	Integer type; // 1 = published, 2 = new page, 3 = like, 4 = favourites, 5 = following, 6 = commented
	
	String comment; // comment type only!!
	Integer pcount; // new page type only!!
	
	Long adate;
	
	Book book; // bid, title, lcount, ccount, pcount, pic
	User who; // uid, dname, uname, pic
	
	String message;
	String dateStr;
	
	public ObjectId getAid() {
		return aid;
	}
	public void setAid(ObjectId aid) {
		this.aid = aid;
	}
	public Long getUid() {
		return uid;
	}
	public void setUid(Long uid) {
		this.uid = uid;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public Long getAdate() {
		return adate;
	}
	public void setAdate(Long adate) {
		this.adate = adate;
	}
	public User getWho() {
		return who;
	}
	public void setWho(User who) {
		this.who = who;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Book getBook() {
		return book;
	}
	public void setBook(Book book) {
		this.book = book;
	}
	public String getDateStr() {
		return dateStr;
	}
	public void setDateStr(String dateStr) {
		this.dateStr = dateStr;
	}
	public Integer getPcount() {
		return pcount;
	}
	public void setPcount(Integer pcount) {
		this.pcount = pcount;
	}
}
