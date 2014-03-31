package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.mbooking.model.Follow;

public interface FollowRepository extends MongoRepository<Follow, String>, FollowRepostitoryCustom {
	List<Follow> findByAuid(Long auid);
	List<Follow> findByUid(Long uid);
	
}