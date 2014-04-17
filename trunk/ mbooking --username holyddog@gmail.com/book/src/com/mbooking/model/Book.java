package com.mbooking.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "books")
public class Book {
	@Id
	Long bid;
	String title;
	String desc;
	String period;
	Long uid; // author id
	String pic;
	Integer pcount;
	Integer fcount;
	Long fdate;
	Long tdate;
	String[] tags;
	Long pbdate;
	Integer seq;

	Long ledate; // Last Edit Date

	// Return from Service Only , Not in db
	User author;
	List<Page> pages;
	String strtime;

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

	public Long getPbdate() {
		return pbdate;
	}

	public void setPbdate(Long pbdate) {
		this.pbdate = pbdate;
	}

	// Return from Service Only , Not in db
	public User getAuthor() {
		return author;
	}

	public void setAuthor(User author) {
		this.author = author;
	}

	public List<Page> getPages() {
		return pages;
	}

	public void setPages(List<Page> pages) {
		this.pages = pages;
	}

	public String getStrtime() {
		return strtime;
	}

	public void setStrtime(String strtime) {
		this.strtime = strtime;
	}

	public Long getLedate() {
		return ledate;
	}

	public void setLedate(Long ledate) {
		this.ledate = ledate;
	}

}
