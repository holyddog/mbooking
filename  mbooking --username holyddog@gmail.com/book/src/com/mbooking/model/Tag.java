package com.mbooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tags")
public class Tag {
	@Id
	String tag;
	Integer count;
	
	String label;
	Boolean cat;
	Boolean exp;
	Integer seq;

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public Boolean getCat() {
		return cat;
	}

	public void setCat(Boolean cat) {
		this.cat = cat;
	}

	public Boolean getExp() {
		return exp;
	}

	public void setExp(Boolean exp) {
		this.exp = exp;
	}

	public Integer getSeq() {
		return seq;
	}

	public void setSeq(Integer seq) {
		this.seq = seq;
	}
}
