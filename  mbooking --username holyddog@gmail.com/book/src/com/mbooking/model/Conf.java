package com.mbooking.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "conf")
public class Conf {
	@Id
	Long osid;
	String ver;	
	String os;
	Object[] ver_lock;
	
	public Object[] getVer_lock() {
		return ver_lock;
	}
	public void setVer_lock(Object[] ver_lock) {
		this.ver_lock = ver_lock;
	}
	public String getOs() {
		return os;
	}
	public void setOs(String os) {
		this.os = os;
	}
	public Long getOsid() {
		return osid;
	}
	public void setOsid(Long osid) {
		this.osid = osid;
	}
	public String getVer() {
		return ver;
	}
	public void setVer(String ver) {
		this.ver = ver;
	}
}
