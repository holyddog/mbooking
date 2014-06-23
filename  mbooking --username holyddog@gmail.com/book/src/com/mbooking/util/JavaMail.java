package com.mbooking.util;

import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.Message.RecipientType;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class JavaMail {
	public static boolean send(String to, String subject, String bodyHtml) {
		return new JavaMail().sendMail(to, subject, bodyHtml);
	}
	
	private MimeMessage _simpleMessage;
	
	public JavaMail() {		
		String smtp = "mail.senate.co.th";
		String port = "25";
		String authUser = "chanon@senate.co.th";
		String authPwd = "whitedog";
		
		Properties props = new Properties();
		props.put("mail.smtp.host", smtp);
		props.put("mail.smtp.port", port);
		
		props.put("mail.smtp.auth", "true");
		
		SMTPAuthenticator auth = new SMTPAuthenticator(authUser, authPwd);
		
		Session mailSession = Session.getDefaultInstance(props, auth);
		_simpleMessage = new MimeMessage(mailSession);
	}
	
	public boolean sendMail(String to, String subject, String text) {
		String from = "chanon@senate.co.th";
		
		InternetAddress fromAddress = null;
		InternetAddress toAddress = null;
		try {
			fromAddress = new InternetAddress("\"Mugendai\" <" + from + ">");
			toAddress = new InternetAddress(to);
		} 
		catch (AddressException e) {
			e.printStackTrace();
			return false;
		} 
		
		try {			
			Multipart mp = new MimeMultipart();
	        MimeBodyPart htmlPart = new MimeBodyPart();
	        htmlPart.setContent(text, "text/html; charset=utf-8");
	        mp.addBodyPart(htmlPart);	        
	        _simpleMessage.setContent(mp);
			
	        _simpleMessage.setFrom(fromAddress);
	        _simpleMessage.setRecipient(RecipientType.TO, toAddress);
	        _simpleMessage.setSubject(subject, "utf-8");
			
			Transport.send(_simpleMessage);			
		} 
		catch (MessagingException e) {
			e.printStackTrace();
			return false;
		}		
		return true;
	}
	
	public class SMTPAuthenticator extends javax.mail.Authenticator {
		private String account;
		private String password;
		
		public SMTPAuthenticator(String acc, String pwd){
			account = acc;
			password = pwd;
		}
		public PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication(account, password);
		}
	}
}
