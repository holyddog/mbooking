package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.Page;
import com.mbooking.model.User;

public interface PageRepository extends MongoRepository<Page, String>, PageRepostitoryCustom {
	@Query(value = "{ 'pid': ?0 }", fields = "{ 'pid': 1 ,'seq': 1, 'pic': 1, 'caption': 1 }")
	Page findByPid(Long pid);
	List<Page> findByBid(Long bid);
	List<Page> findByBidAndUid(Long bid,Long uid);
}