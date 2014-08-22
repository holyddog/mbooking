package com.mbooking.controller.json;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.mbooking.common.ErrorResponse;
import com.mbooking.common.ResultResponse;
import com.mbooking.model.Book;
import com.mbooking.model.Page;
import com.mbooking.repository.ActivityRepository;
import com.mbooking.repository.PageRepository;
import com.mbooking.util.ConfigReader;
import com.mbooking.util.Convert;
import com.mbooking.util.ImageUtils;

@Controller
public class PageJson {
	@Autowired
	PageRepository pageRepo;
	@Autowired
	ActivityRepository actRepo;

	@RequestMapping(method = RequestMethod.POST, value = "/addPage.json")
	public @ResponseBody
	Object addPage(
			@RequestParam(value = "pid", required = false) Long pageId,
			@RequestParam(value = "pic") String picture,
			@RequestParam(value = "size") Integer imageSize,
			@RequestParam(value = "crop") Integer cropPos,
			@RequestParam(value = "caption", required = false) String caption,
			@RequestParam(value = "ref", required = false) String ref,
			@RequestParam(value = "bid") Long bookId,
			@RequestParam(value = "uid") Long addBy

	) 
	{
		Page page = pageRepo.add(pageId, picture, imageSize, cropPos, caption, ref, bookId, addBy);
		if (page != null) {
			actRepo.newPage(addBy, bookId);
			return page;
		}
		return ErrorResponse.getError("This page cannot be saved");
	}	
	

	@RequestMapping(method = RequestMethod.POST, value = "/addMultiPages.json")
	public @ResponseBody
	Object addMultiPages(
			@RequestParam(value = "pics") String pics,
			@RequestParam(value = "bid") Long bookId,
			@RequestParam(value = "uid") Long addBy

	) 
	{
		return pageRepo.addMultiPages(pics, addBy, bookId);
	}	

    @RequestMapping(value = "/upload.json", method = RequestMethod.POST)
	public @ResponseBody
	Object upload(
			@RequestParam("file") MultipartFile file,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "name", required = false) String name
			) {
    	if (!file.isEmpty()) {
			try {
		    	String imgPath = "u" + uid + "/b" + bid;
				String uploadPath = ConfigReader.getProp("upload_path") + "/" + imgPath;
				File output = new File(uploadPath);
				if (!output.exists()) {
					output.mkdirs();
				}
				
				String key = Convert.uniqueString(8);
				String image = key + ".jpg";
				
				if (name != null) {
					image = name;
				}
				
				byte[] b = file.getBytes();
				File newFile = new File(uploadPath + "/" + image);
				FileOutputStream out = new FileOutputStream(newFile);  
				out.write(b);  
				out.flush();  
				out.close();
				
				return newFile.getName();
			}
			catch (Exception ex) {
				ex.printStackTrace();
				return ErrorResponse.getError("Upload failed");
			}
    	}
    	return null;
    }
	

    @RequestMapping(value = "/addMultiPage.json", method = RequestMethod.POST)
	public @ResponseBody
	Object uploadFileHandler(
			@RequestParam("file") MultipartFile file,
			@RequestParam(value = "bid") Long bookId,
			@RequestParam(value = "uid") Long addBy
			) {
		if (!file.isEmpty()) {
			try {
				byte[] bytes = file.getBytes();

				// Creating the directory to store file
//				File dir = new File(ConfigReader.getProp("upload_path")+"u" + addBy + "/b" + bookId);
				
				String imgPath ="u" + addBy +File.separator+ "b" + bookId;
				File dir = new File("C:/temp/"+imgPath);
				if (!dir.exists())
					dir.mkdirs();

				String key = ImageUtils.uniqueString(8);
				imgPath += File.separator + key+".jpg";
				
				File serverFile = new File("C:/temp/"+imgPath);
				
				BufferedOutputStream stream = new BufferedOutputStream(
						new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				return  pageRepo.addMulti(imgPath,serverFile, bookId, addBy);
				
			} catch (Exception e) {
				return "You failed to upload  => " + e.getMessage();
			}
		} else {
			return "You failed to upload because the file was empty.";
		}
	}


	@RequestMapping(method = RequestMethod.POST, value = "/changeSeq.json")
	public @ResponseBody
	Object changeSeq(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "fseq") Integer fseq,
			@RequestParam(value = "tseq") Integer tseq

	) {
		pageRepo.changeSeq(bid, fseq, tseq);
		return ResultResponse.getResult("success", true);
	}
	

	@RequestMapping(method = RequestMethod.POST, value = "/editCaption.json")
	public @ResponseBody
	Object editCaption(
			@RequestParam(value = "pid") Long pid,
			@RequestParam(value = "caption") String caption

	) {
		return ResultResponse.getResult("success", pageRepo.editCaption(pid, caption));
	}

	@RequestMapping(method = RequestMethod.POST, value = "/createPage.json")
	public @ResponseBody
	Object createPage(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "date", required = false) Long date,
			@RequestParam(value = "caption", required = false) String caption

	) 
	{
		Book b = pageRepo.create(bid, uid, date, pic, caption);
		if (b != null) {
			return b;
		}
		return ErrorResponse.getError("Error, No page added");
	}

	@RequestMapping(method = RequestMethod.POST, value = "/editPage.json")
	public @ResponseBody
	Object editPage(
			@RequestParam(value = "pid") Long pid,
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "date", required = false) Long date,
			@RequestParam(value = "caption", required = false) String caption

	) 
	{

		Page page = pageRepo.edit(pid, uid, bid, date, pic, caption);
		if (page != null) {
			return page;
		}

		return ErrorResponse.getError("Unsuccess to edit page id: " + pid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/deletePage.json")
	public @ResponseBody
	Object deletePage(
			@RequestParam(value = "pid") Long pid,
			@RequestParam(value = "bid") Long bid) 
	{
		return ResultResponse.getResult("success", pageRepo.delete(pid, bid));
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getBookPages.json")
	public @ResponseBody
	Object getBookPages(
			@RequestParam(value = "bid") Long bid) 
	{
		List<Page> pages = pageRepo.findByBid(bid);
		if (pages != null) {
			return pages;
		}

		return ErrorResponse.getError("Book page not found");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getPage.json")
	public @ResponseBody
	Object getPage(@RequestParam(value = "pid") Long pid) {
		Page page = pageRepo.findByPid(pid);
		if (page != null) {
			return page;
		}
		return ErrorResponse.getError("Page not found");
	}
}
