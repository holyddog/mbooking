package com.mbooking.repository;

import java.util.List;

import com.mbooking.model.Notification;

public interface NotificationRepositoryCustom {

	public List<Notification> findNotificationsByUid(Long uid, Integer skip, Integer limit);

}