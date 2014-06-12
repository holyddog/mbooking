package com.mbooking.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
	@Id
	Long uid;
	@Indexed(unique = true)
	String email;
	@Indexed
	String dname; // display name
	@Indexed(unique = true)
	String uname; // username
	String pic;
	String pwd;
	Boolean inactive;

	Integer fcount; // Follower book count
	Integer fgcount; // Following book count
	
	Integer pbcount; // public book count
	Integer prcount; // private book count
	Integer drcount; // draft book count
	
	Integer tcount; // Total book count

	Object[] following;
	Object[] everfoll;

	Long lstin;		//last login
	FBobj fbobj;
	
	Boolean unlinkfb;

	// Service return
	List<Book> books;
	Boolean isFollow;
	String cover; // cover image from last publish book
	
	
	
	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDname() {
		return dname;
	}

	public void setDname(String dname) {
		this.dname = dname;
	}

	public String getUname() {
		return uname;
	}

	public void setUname(String uname) {
		this.uname = uname;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public Boolean getInactive() {
		return inactive;
	}

	public void setInactive(Boolean inactive) {
		this.inactive = inactive;
	}

	public String getPic() {
		return pic;
	}

	public void setPic(String pic) {
		this.pic = pic;
	}

	public Integer getFcount() {
		return fcount;
	}

	public void setFcount(Integer fcount) {
		this.fcount = fcount;
	}

	public Integer getFgcount() {
		return fgcount;
	}

	public void setFgcount(Integer fgcount) {
		this.fgcount = fgcount;
	}

	public Integer getPbcount() {
		return pbcount;
	}

	public void setPbcount(Integer pbcount) {
		this.pbcount = pbcount;
	}

	public Integer getTcount() {
		return tcount;
	}

	public void setTcount(Integer tcount) {
		this.tcount = tcount;
	}

	public Integer getPrcount() {
		return prcount;
	}

	public void setPrcount(Integer prcount) {
		this.prcount = prcount;
	}

	public Integer getDrcount() {
		return drcount;
	}

	public void setDrcount(Integer drcount) {
		this.drcount = drcount;
	}

	public Object[] getFollowing() {
		return following;
	}

	public void setFollowing(Object[] following) {
		this.following = following;
	}

	public List<Book> getBooks() {
		return books;
	}

	public void setBooks(List<Book> books) {
		this.books = books;
	}

	public Boolean getIsFollow() {
		return isFollow;
	}

	public void setIsFollow(Boolean isFollow) {
		this.isFollow = isFollow;
	}

	public String getCover() {
		return cover;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	public void setFollowing(Long[] following) {
		this.following = following;
	}
	
	public Long getLstin() {
		return lstin;
	}

	public void setLstin(Long lstin) {
		this.lstin = lstin;
	}
	public FBobj getFbobj() {
		return fbobj;
	}

	public void setFbobj(FBobj fbobj) {
		this.fbobj = fbobj;
	}
	
	public Boolean getUnlinkfb() {
		return unlinkfb;
	}

	public void setUnlinkfb(Boolean unlinkfb) {
		this.unlinkfb = unlinkfb;
	}
	public Object[] getEverfoll() {
		return everfoll;
	}

	public void setEverfoll(Object[] everfoll) {
		this.everfoll = everfoll;
	}	
}
