package com.mbooking.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pages")
public class Page {
	@Id
	Long pid;
	
	Long bid;
	Long uid;
	
	Integer seq;
	Long cdate;	//Create Date
	Long date;	//Date
	
	String pic;
	String caption;
	
	Boolean lpage;	//last create page
	
	// Return from Service Only , Not in db
	User author;
	String strtime;
	Book book;

	public Long getPid() {
		return pid;
	}
	public void setPid(Long pid) {
		this.pid = pid;
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
	public Integer getSeq() {
		return seq;
	}
	public void setSeq(Integer seq) {
		this.seq = seq;
	}
	public Long getCdate() {
		return cdate;
	}
	public void setCdate(Long cdate) {
		this.cdate = cdate;
	}
	public Long getDate() {
		return date;
	}
	public void setDate(Long date) {
		this.date = date;
	}
	public String getPic() {
		return pic;
	}
	public void setPic(String pic) {
		this.pic = pic;
	}
	public String getCaption() {
		return caption;
	}
	public void setCaption(String caption) {
		this.caption = caption;
	}
	
	public Boolean getLpage() {
		return lpage;
	}
	public void setLpage(Boolean lpage) {
		this.lpage = lpage;
	}
	
	// Return from Service Only , Not in db
	public User getAuthor() {
		return author;
	}
	public void setAuthor(User author) {
		this.author = author;
	}
	public String getStrtime() {
		return strtime;
	}
	public void setStrtime(String strtime) {
		this.strtime = strtime;
	}
	
	public Book getBook() {
		return book;
	}
	public void setBook(Book book) {
		this.book = book;
	}
}
