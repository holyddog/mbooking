package com.mbooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mbooking.model.Activity;

public interface ActivityRepository extends MongoRepository<Activity, String>, ActivityRepostitoryCustom {
}