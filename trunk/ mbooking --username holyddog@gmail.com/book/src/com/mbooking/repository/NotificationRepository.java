package com.mbooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mbooking.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String>, NotificationRepositoryCustom {
	
}