package com.mbooking.util;

import org.joda.time.DateTime;

public class TimeUtils {

	@SuppressWarnings("deprecation")
	public static String timefromNow(long startdate,long enddate) {
		DateTime stdate = new DateTime(startdate);
		DateTime edate = new DateTime(enddate);
		 StringBuffer res = new StringBuffer();
		 
		int styear = stdate.getYear();
		int eyear = edate.getYear();
		
		int stmonth = stdate.getMonthOfYear();
		int emonth = edate.getMonthOfYear();
		
		int y_period = eyear-styear;
		int m_period = emonth - stmonth;
		
		
		if(y_period>1||(y_period==1&&m_period>-11)){
	
			if(m_period<0){
				y_period-=1;
				m_period+=12;
			}
			
			if(y_period>0)
			res.append(y_period).append(" year").append(y_period > 1 ? "s" : "");
			
			
			
		}else if(m_period<2||(y_period==1&&m_period==-11)){
			
			
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
		    
		    
			long DAYS = 30;
		    if(m_period==0)
		        DAYS = stdate.dayOfMonth().withMaximumValue().toDate().getDate();
		    
		    long ONE_MONTH = ONE_DAY * DAYS;

		    long temp = 0;
		    
	          temp = duration / ONE_MONTH;
	          if (temp > 0) {
	            return (res.append(temp).append(" month ago")).toString();
	               
	          }
	          temp = duration / ONE_DAY;
	          if (temp > 0) {
	            res.append(temp).append(" day").append(temp > 1 ? "s" : "");
	            return res.toString()+" ago";  
	          }

	          temp = duration / ONE_HOUR;
	          boolean is_hour=false;
	          if (temp > 0) {
	            duration -= temp * ONE_HOUR;
	            res.append(temp).append(" hour").append(temp > 1 ? "s" : "");
	            is_hour = true;
	          }

	          temp = duration / ONE_MINUTE;
	          if (temp > 0) {
	            duration -= temp * ONE_MINUTE;
	            res.append(is_hour==true?" and ":"").append(temp).append(" minute").append(temp > 1 ? "s" : "");
	            if(is_hour==true) return res.toString()+" ago";
	          }

	          temp = duration / ONE_SECOND;
	          if (temp > 0) {
	            res.append(!res.toString().equals("")?" and ":"").append(temp).append(" second").append(temp > 1 ? "s" : "");
	          }
	          return res.toString()+" ago";

		   
			
		}
		res.append(y_period > 0 ? " and ":"").append(m_period+" month").append(m_period > 1 ? "s" : "");		
		
		return res.toString()+" ago";
	}

}
