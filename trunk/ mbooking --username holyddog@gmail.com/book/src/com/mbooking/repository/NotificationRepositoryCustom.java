package com.mbooking.repository;

import java.util.List;

import com.mbooking.model.Notification;


public interface NotificationRepositoryCustom {

	public Boolean hadBeenRead(
			Long ntid
	);

	public List<Notification> findNotificationsByUid(
			Long uid,
			Integer skip,
			Integer limit
	);
}
