package com.mbooking.repository;

import java.util.List;

import com.mbooking.model.Activity;


public interface ActivityRepostitoryCustom {
	List<Activity> findFollowActivities(Long uid, Integer start, Integer limit);
	
	void published(Long uid, Long bid);
	void newPage(Long uid, Long bid);
	void liked(Long uid, Long bid);
	void favourite(Long uid, Long bid);
	void startedFollowing(Long uid, Long who);
	void commented(Long uid, Long bid, String comment);
}
