package com.mbooking.controller.json;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.mbooking.common.ErrorResponse;
import com.mbooking.model.Page;
import com.mbooking.util.PushNotification;
import com.urbanairship.api.push.model.audience.Selector;
import com.urbanairship.api.push.model.audience.Selectors;


@Controller
public class TestJson {

	   /**
     * Upload single file using Spring Controller
     */
    @RequestMapping(value = "/uploadFile", method = RequestMethod.POST)
	public @ResponseBody
	String uploadFileHandler(
			@RequestParam("file") MultipartFile file) {

    	String name = "test";
		if (!file.isEmpty()) {
			try {
				byte[] bytes = file.getBytes();

				// Creating the directory to store file
				String rootPath = System.getProperty("catalina.home");
				File dir = new File("C:" + File.separator + "temp");
				if (!dir.exists())
					dir.mkdirs();

				// Create the file on server
				File serverFile = new File(dir.getAbsolutePath()
						+ File.separator + name+".jpg");
				BufferedOutputStream stream = new BufferedOutputStream(
						new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				return "You successfully uploaded file=" + name;
			} catch (Exception e) {
				return "You failed to upload " + name + " => " + e.getMessage();
			}
		} else {
			return "You failed to upload " + name
					+ " because the file was empty.";
		}
	}
    
    
	@RequestMapping(method = RequestMethod.GET, value = "/pushNote.json")
	public @ResponseBody
	Object pushNote() {
	
		HashMap<String, String> map = new HashMap<String, String>();
//		map.put("page", "Book");
//		map.put("bid", "1");
		map.put("page", "Book");
		map.put("bid","1");
		PushNotification.sendPush("Send the push", Selectors.alias("dev@senate.co.th"),null,map);
		
		return "Success";

	}
    
}