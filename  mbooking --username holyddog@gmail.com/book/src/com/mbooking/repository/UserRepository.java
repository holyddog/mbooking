package com.mbooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.User;

public interface UserRepository extends MongoRepository<User, String>, UserRepostitoryCustom {
	@Query(value="{ 'email' : ?0 }", fields="{ 'email' : 1 }")
	User findByEmail(String email);
	@Query(value="{ 'uname' : ?0 }", fields="{ 'uname' : 1 }")
	User findByUserName(String userName);
}