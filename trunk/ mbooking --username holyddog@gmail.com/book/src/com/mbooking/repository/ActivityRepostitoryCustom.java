package com.mbooking.repository;


public interface ActivityRepostitoryCustom {
	void published(Long uid, Long bid);
	void newPage(Long uid, Long bid);
	void liked(Long uid, Long bid);
	void favourite(Long uid, Long bid);
	void startedFollowing(Long uid, Long who);
	void commented(Long uid, Long bid, String comment);
}
