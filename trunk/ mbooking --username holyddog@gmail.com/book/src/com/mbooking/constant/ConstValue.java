package com.mbooking.constant;

public interface ConstValue {
	public static final String DATE_FORMAT = "dd/MM/yyyy";
	
	public static final String[] MONTH_EN_NAMES = {
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	};
	public static final String[] MONTH_EN_SNAMES = {
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	};

	public static final int PROFILE_SIZE = 125;
	
	public static final int SMALL_SIZE = 270;
	public static final int NORMAL_SIZE = 500;
	public static final int LARGE_SIZE = 800;
	public static final int EXTRA_LARGE_SIZE = 1024;
	
	public static final int COVER_HEIGHT_SIZE = 240;
	public static final int COVER_WIDTH_SIZE = 180;

	
	public static final String USER_FOLDER ="u";
	public static final String BOOK_FOLDER ="b";
	
	//Image Type
	public static final int NONE_TYPE =0;
	public static final int PAGE_IMG_TYPE =1;
	public static final int PROFILE_IMG_TYPE =2;
	
	//Notification Type
	public static final int NEW_FOLLOWER =1;
	public static final int FOLLOWER_COMMENT =2;
	
	
	public static final String NEW_FOLLOWER_MSG_FORMAT_EN = "%s is now following your story";
	public static final String FOLLOWER_COMMENT_MSG_FORMAT_EN = "%s commented on %s :%s";
	
}