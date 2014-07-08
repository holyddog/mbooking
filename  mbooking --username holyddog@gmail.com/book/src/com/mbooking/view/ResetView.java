package com.mbooking.view;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.mbooking.model.User;
import com.mbooking.repository.UserRepository;

@Component
@Scope("request")
public class ResetView {
	@Autowired
	UserRepository userRepo;
	
//	@Value("#{request.getParameter('uid')}")
//	private String uid;
	@Value("#{request.getParameter('key')}")
	private String key;
	@Value("#{request.getParameter('success')}")
	private Boolean success;
	
	@PostConstruct
	public void init() {
		

		User user = userRepo.findUserByForgetPwdKey(key);

//		key	
		if(user!=null){
			valid = true;
			dname = user.getDname();
			pic = user.getPic();
			if(pic!=null){
				pic = pic.replace(".jpg", "_sp.jpg");
			}
			
		}
		else
			valid = false;
		
		if (success == null)
			success = false;
	}
	
	private boolean valid;
	private String dname,pic;
	
	public boolean isValid() {
		return valid;
	}
	public Boolean getSuccess() {
		return success;
	}
	
	public String getDname() {
		return dname;
	}
	
	public String getPic() {
		return pic;
	}
}
