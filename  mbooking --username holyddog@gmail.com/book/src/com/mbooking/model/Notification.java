package com.mbooking.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notices")
public class Notification {

	@Id
	ObjectId _id;
	
	Long uid;	
	Long bid;
	
	Long follid;	//Follower id
	Long auid;		//Author (book writer) id
	
	Integer ntype;	// 1 : Has new follower, 2: Follower comment book
	
	String message;
	
	String dname;	// Name of someone who do action
	String pic;		// Picture of someone who do action
	
	String bpic;	// Book picture
	String bname;	// Book name
	
	Long adate;		//Action date

	//Service return
	String strtime;
	
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

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public Long getFollid() {
		return follid;
	}

	public void setFollid(Long follid) {
		this.follid = follid;
	}

	public Long getAuid() {
		return auid;
	}

	public void setAuid(Long auid) {
		this.auid = auid;
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

	public String getDname() {
		return dname;
	}

	public void setDname(String dname) {
		this.dname = dname;
	}

	public String getPic() {
		return pic;
	}

	public void setPic(String pic) {
		this.pic = pic;
	}

	public String getBpic() {
		return bpic;
	}

	public void setBpic(String bpic) {
		this.bpic = bpic;
	}

	public String getBname() {
		return bname;
	}

	public void setBname(String bname) {
		this.bname = bname;
	}

	public Long getAdate() {
		return adate;
	}

	public void setAdate(Long adate) {
		this.adate = adate;
	}

	public String getStrtime() {
		return strtime;
	}

	public void setStrtime(String strtime) {
		this.strtime = strtime;
	}
}
