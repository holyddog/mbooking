package com.mbooking.util;

import java.io.IOException;
import java.util.Map;
import com.urbanairship.api.client.APIClient;
import com.urbanairship.api.client.APIClientResponse;
import com.urbanairship.api.client.APIError;
import com.urbanairship.api.client.APIErrorDetails;
import com.urbanairship.api.client.APIPushResponse;
import com.urbanairship.api.client.APIRequestException;
import com.urbanairship.api.push.model.Platform;
import com.urbanairship.api.push.model.PlatformData;
import com.urbanairship.api.push.model.PushPayload;
import com.urbanairship.api.push.model.audience.Selector;
import com.urbanairship.api.push.model.audience.Selectors;
import com.urbanairship.api.push.model.notification.Notification;
import com.urbanairship.api.push.model.notification.Notifications;
import com.urbanairship.api.push.model.notification.android.AndroidDevicePayload;
import com.urbanairship.api.push.model.notification.ios.IOSBadgeData;
import com.urbanairship.api.push.model.notification.ios.IOSBadgeData.Type;
import com.urbanairship.api.push.model.notification.ios.IOSDevicePayload;


public class PushNotification {

	public static void sendPush(String message,Selector selector,Integer badge,Map<String, String> entries) {
		  String appKey = ConfigReader.getProp("appKey");
	      String appSecret = ConfigReader.getProp("appSecret");
	      if(selector==null){
	    	  selector = Selectors.all();
	      }
	      
	        APIClient apiClient = APIClient.newBuilder()
	                                       .setKey(appKey)
	                                       .setSecret(appSecret)
	                                       .build();
	        
	        Type badgetype = IOSBadgeData.Type.VALUE;
	        if(badge==null||badge==0){
	        	badgetype = IOSBadgeData.Type.INCREMENT;
	        	badge = 1;
	        }
	        
	        IOSBadgeData badgeData = IOSBadgeData.newBuilder()
                    .setValue(badge)
                    .setType(badgetype)
                    .build();

	        IOSDevicePayload iosPayload;
	        AndroidDevicePayload  androidPayload;
	        if(entries!=null){
		        iosPayload = IOSDevicePayload.newBuilder()
	                    .setAlert(message)
	                    .setBadge(badgeData)
	                    .setSound("default")
	                    .addAllExtraEntries(entries)
	                    .build();
		        androidPayload = AndroidDevicePayload.newBuilder()
	                    .setAlert(message)
	                    .addAllExtraEntries(entries)
	                    .build();
	        }
	        else{
	        	iosPayload = IOSDevicePayload.newBuilder()
	                    .setAlert(message)
	                    .setBadge(badgeData)
	                    .setSound("default")
	                    .build();
	        	androidPayload = AndroidDevicePayload.newBuilder()
	                    .setAlert(message)
	                    .build();
		    }
	        
	        Notification notification = Notifications.notification(iosPayload,androidPayload);
	        
	        PushPayload payload = PushPayload.newBuilder()
                    .setAudience(selector)
                    .setNotification(notification)
                    .setPlatforms(PlatformData.of(Platform.IOS, Platform.ANDROID))
                    .build();
	        
	       
	        try {
	            APIClientResponse<APIPushResponse> response = apiClient.push(payload);
	            System.out.println("Send the message");
	            System.out.println(response);
	        }
	        catch (APIRequestException ex){
	        	System.out.println(String.format("APIRequestException " + ex));
	        	System.out.println("EXCEPTION " + ex.toString());
	            APIError apiError = ex.getError().get();
	           System.out.println("Error " + apiError.getError());
	            if (apiError.getDetails().isPresent())     {
	                APIErrorDetails apiErrorDetails = apiError.getDetails().get();
	                System.out.println("Error details " + apiErrorDetails.getError());
	            }
	        }
	        catch (IOException e){
	        	System.out.println("IOException in API request " + e.getMessage());
	        }

	    }
	
}
