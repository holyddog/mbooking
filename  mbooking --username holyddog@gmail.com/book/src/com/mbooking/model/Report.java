package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reports")
public class Report {
	@Id
	ObjectId rid;
	
	// MainType
	// 1 = Story
	// 2 = Comment
	// 3 = User
	//
	// Sub Type	
	//	Nudity or pornography
	//	Attacks a group or individual
	//	Graphic violence
	//	Spam
	//	Copyright & trademark
	//	Hateful speech or symbols
	//	Other...
	//
	Integer type;
	Integer subtype;
	Long uid;
	
	String msg;
	
	Long bid;
	Long auid;
	Long cmid;
	String uname;
	String auname;
	String comment;

	Long rdate;

	Boolean inacive;
	
	public Boolean getInacive() {
		return inacive;
	}

	public void setInacive(Boolean inacive) {
		this.inacive = inacive;
	}

	public Long getAuid() {
		return auid;
	}

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
	public Integer getSubtype() {
		return subtype;
	}

	public void setSubtype(Integer subtype) {
		this.subtype = subtype;
	}

	public Long getCmid() {
		return cmid;
	}

	public void setCmid(Long cmid) {
		this.cmid = cmid;
	}
	public Long getAuthor() {
		return auid;
	}

	public void setAuid(Long auid) {
		this.auid = auid;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getUname() {
		return uname;
	}

	public void setUname(String uname) {
		this.uname = uname;
	}

	public String getAuname() {
		return auname;
	}

	public void setAuname(String auname) {
		this.auname = auname;
	}
}
