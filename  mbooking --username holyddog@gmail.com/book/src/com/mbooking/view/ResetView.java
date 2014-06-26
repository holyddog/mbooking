package com.mbooking.view;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.mbooking.repository.UserRepository;

@Component
@Scope("request")
public class ResetView {
	@Autowired
	UserRepository userRepo;
	
	@Value("#{request.getParameter('uid')}")
	private String uid;
	@Value("#{request.getParameter('key')}")
	private String key;
	@Value("#{request.getParameter('success')}")
	private Boolean success;
	
	@PostConstruct
	public void init() {
		System.out.println(uid + ", " + key);	
		valid = true;
		
		if (success == null)
			success = false;
	}
	
	private boolean valid;
	public boolean isValid() {
		return valid;
	}
	public Boolean getSuccess() {
		return success;
	}
}
