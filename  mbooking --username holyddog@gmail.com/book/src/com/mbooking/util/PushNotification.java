package com.mbooking.util;
import java.util.Map;
import com.urbanairship.api.push.model.audience.Selector;

public class PushNotification {

	public static void sendPush(String message,Selector selector,Integer badge,Map<String, String> entries) {
		Runnable r = new PushnotificationThread( message,selector, badge,entries);
		new Thread(r).start();
	}
}
