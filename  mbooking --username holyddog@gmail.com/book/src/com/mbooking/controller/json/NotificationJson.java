package com.mbooking.controller.json;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mbooking.common.ErrorResponse;
import com.mbooking.common.ResultResponse;
import com.mbooking.model.Notification;
import com.mbooking.repository.NotificationRepository;

public class NotificationJson {

	@Autowired
	NotificationRepository notificationRepo;
	
	@RequestMapping(method = RequestMethod.POST, value = "/readedNotification.json")
	public @ResponseBody
	Object readedNotification(
			@RequestParam(value = "ntid") Long ntid
		) {
		
		return ResultResponse.getResult("success",  notificationRepo.hadBeenRead(ntid));
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getNotificationByUid.json")
	public @ResponseBody
	Object getNotificationByUid(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "skip", required = false) Integer skip,
			@RequestParam(value = "limit", required = false) Integer limit
		) {
		List<Notification> notification = notificationRepo.findNotificationsByUid(uid, skip, limit);  
		if(notification!=null){
			return notification;
		}
		
		return ErrorResponse.getError("Unsuccess to find notication by uid: "+uid);
		
	}
	
}
