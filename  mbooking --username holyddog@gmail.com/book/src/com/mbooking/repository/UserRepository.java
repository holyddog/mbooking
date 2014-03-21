package com.mbooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mbooking.model.User;

public interface UserRepository extends MongoRepository<User, String>, UserRepostitoryCustom {
	User findByUid(Long uid);
}