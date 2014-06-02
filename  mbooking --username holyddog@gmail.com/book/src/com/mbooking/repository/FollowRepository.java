package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.Follow;

public interface FollowRepository extends MongoRepository<Follow, String>, FollowRepostitoryCustom {
	
}