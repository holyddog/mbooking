package com.mbooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "book")
public class Book {
	@Id
	Long bid;
	String title;
	String desc;
	String period;
	Long uid;
	String pic;
	Integer pcount;
	Integer fcount;
	Long fdate;
	Long tdate;
	String []tags;
	Long publish_date;
	Integer seq;
	
	//Return from Service Only , Not in db
	User author;
	Page[] pages;
	
	public void setBid(Long bid) {
		this.bid = bid;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getPeriod() {
		return period;
	}
	public void setPeriod(String period) {
		this.period = period;
	}
	
	public Long getUid() {
		return uid;
	}
	public void setUid(Long uid) {
		this.uid = uid;
	}
	public String[] getTags() {
		return tags;
	}
	public void setTags(String[] tags) {
		this.tags = tags;
	}
	public String getPic() {
		return pic;
	}
	public void setPic(String pic) {
		this.pic = pic;
	}
	public Integer getPcount() {
		return pcount;
	}
	public void setPcount(Integer pcount) {
		this.pcount = pcount;
	}
	public Integer getFcount() {
		return fcount;
	}
	public void setFcount(Integer fcount) {
		this.fcount = fcount;
	}
	public Long getFdate() {
		return fdate;
	}
	public void setFdate(Long fdate) {
		this.fdate = fdate;
	}
	public Long getTdate() {
		return tdate;
	}
	public void setTdate(Long tdate) {
		this.tdate = tdate;
	}
	public Integer getSeq() {
		return seq;
	}
	public void setSeq(Integer seq) {
		this.seq = seq;
	}
	public Long getBid() {
		return bid;
	}
	public Long getPublish_date() {
		return publish_date;
	}
	public void setPublish_date(Long publish_date) {
		this.publish_date = publish_date;
	}
	
	
	//Return from Service Only , Not in db
	public User getAuthor() {
		return author;
	}
	public void setAuthor(User author) {
		this.author = author;
	}
	
	public Page[] getPages() {
		return pages;
	}
	public void setPages(Page[] pages) {
		this.pages = pages;
	}
}
