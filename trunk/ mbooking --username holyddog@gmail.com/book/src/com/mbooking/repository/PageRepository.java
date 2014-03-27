package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.mbooking.model.Page;
import com.mbooking.model.User;

public interface PageRepository extends MongoRepository<Page, String>, PageRepostitoryCustom {
	Page findByPid(Long pid);
	List<Page> findByBid(Long bid);
	List<Page> findByBidAndUid(Long bid,Long uid);
}