package com.mbooking.util;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class TimeUtils {

	public static String timefromNow(long startdate,long enddate) {
		DateTime stdate = new DateTime(startdate);
		DateTime edate = new DateTime(enddate);
		 StringBuffer res = new StringBuffer();
		 
		int styear = stdate.getYear();
		int eyear = edate.getYear();
		int y_period = eyear-styear;

			long duration = enddate-startdate;
			long ONE_SECOND = 1000;
			
			if(duration / ONE_SECOND<=0){
				  return "0 second ago";
			}
			
			long SECONDS = 60;
		    long ONE_MINUTE = ONE_SECOND * SECONDS;
		    long MINUTES = 60;
		    long ONE_HOUR = ONE_MINUTE * MINUTES;
		    long HOURS = 24;
		    long ONE_DAY = ONE_HOUR * HOURS;
		    long DAYS = 8;
		    long ONE_WEEK = ONE_DAY * DAYS;
		    
		    long temp = 0;
		    
	          temp = duration / ONE_WEEK;
	          if (temp > 0) {
	        	  duration =0;
	          }
		    
	          temp = duration / ONE_DAY;
	          if (temp > 0) {
	        	if(temp>1){
	        		res.append(temp).append(" day").append(temp > 1 ? "s" : "");
	            	return res.toString()+" ago";  
	        	}
	        	else {
	        		return "Yesterday";  
		        }
	          }

	          temp = duration / ONE_HOUR;

	          if (temp > 0) {
	            res.append(temp).append(" hour").append(temp > 1 ? "s" : "");
	            return res.toString()+" ago";
	          }

	          temp = duration / ONE_MINUTE;
	          if (temp > 0) {
	            res.append(temp).append(" minute").append(temp > 1 ? "s" : "");
	            return res.toString()+" ago";
	          }

	          temp = duration / ONE_SECOND;
	          if (temp > 0) {
	            res.append(temp).append(" second").append(temp > 1 ? "s" : "");
	            return res.toString()+" ago";
	          }
			
		DateTimeFormatter formatter = DateTimeFormat.forPattern("MMMM d"+(y_period>0?", yyyy":""));
		String formattedDate = formatter.print(startdate);
		return  formattedDate;	 

	}

}
