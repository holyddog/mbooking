package com.mbooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.User;

public interface UserRepository extends MongoRepository<User, String>, UserRepostitoryCustom {
	@Query(value="{ 'uid' : ?0 }", fields="{ 'uid' : 1, 'email' : 1, 'dname' : 1, 'uname' : 1, 'leb' : 1, 'fcount' : 1, 'fgcount' : 1, 'pbcount' : 1, 'tcount' : 1 }")
	User findById(Long uid);
	@Query(value="{ 'email' : ?0 }", fields="{ 'email' : 1, 'leb' : 1, 'fcount' : 1, 'fgcount' : 1, 'pbcount' : 1, 'tbcount' : 1 }")
	User findByEmail(String email);
	@Query(value="{ 'uname' : ?0 }", fields="{ 'uname' : 1 ,'leb' : 1, 'fcount' : 1, 'fgcount' : 1, 'pbcount' : 1, 'tbcount' : 1}")
	User findByUserName(String userName);
}
