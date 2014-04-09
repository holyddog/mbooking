package com.mbooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")

public class Comment {
	@Id
	Long cmid;
	
	Long bid;		//Tune by indexing collection with bid
	Long uid;	
	String dname;
	String pic;
	String comment;
	Long pdate;
	String strtime;
	
	public Long getUid() {
		return uid;
	}
	public void setUid(Long uid) {
		this.uid = uid;
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
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public Long getCmid() {
		return cmid;
	}
	public void setCmid(Long cmid) {
		this.cmid = cmid;
	}
	public Long getBid() {
		return bid;
	}
	public void setBid(Long bid) {
		this.bid = bid;
	}
	public Long getPdate() {
		return pdate;
	}
	public void setPdate(Long pdate) {
		this.pdate = pdate;
	}
	public String getStrtime() {
		return strtime;
	}
	public void setStrtime(String strtime) {
		this.strtime = strtime;
	}
}
