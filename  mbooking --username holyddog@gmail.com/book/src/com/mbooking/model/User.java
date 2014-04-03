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

	Long leb;		//last edit book
	String lebt;	//last edit book title
	String lebp;	//last edit book picture

	List<Book> books;

	Integer fcount;			//Follower book count
	Integer fgcount;		//Following book count
	Integer pbcount;		//Public book count
	Integer tcount;		//Total book count

	
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
	
	public List<Book> getBooks() {
		return books;
	}

	public void setBooks(List<Book> books) {
		this.books = books;
	}
	public Long getLeb() {
		return leb;
	}

	public void setLeb(Long leb) {
		this.leb = leb;
	}
	
	public String getLebt() {
		return lebt;
	}

	public void setLebt(String lebt) {
		this.lebt = lebt;
	}
	
	public String getLebp() {
		return lebp;
	}

	public void setLebp(String lebp) {
		this.lebp = lebp;
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

}
