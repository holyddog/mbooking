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
	String dname; // display name
	@Indexed(unique = true)
	String uname; // username
	String pic;
	String pwd;
	Boolean inactive;

	Book leb;		//last edit book
	Integer fcount;			//Follower book count
	Integer fgcount;		//Following book count
	Integer pbcount;		//Public book count
	Integer tcount;		//Total book count
	
	Long[] following;

	//Service return
	List<Book> books;
	Boolean isFollow;
	
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

	public Book getLeb() {
		return leb;
	}

	public void setLeb(Book leb) {
		this.leb = leb;
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
	public Long[] getFollowing() {
		return following;
	}

	public void setFollows(Long[] following) {
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

}
