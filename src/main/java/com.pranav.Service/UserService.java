package com.pranav.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pranav.DAO.UserDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.User;

@Service
public class UserService {
	@Autowired
	private UserDAO userDAO;

	public ResponseEntity<ResponseStructure<User>> saveUser(User user) {
		User data = userDAO.saveUser(user);
		ResponseStructure<User> rs = new ResponseStructure<User>();
		rs.setData(data);
		rs.setMessage("User Added Successfully");
		rs.setStatusCode(HttpStatus.CREATED.value());
		return new ResponseEntity<ResponseStructure<User>>(rs, HttpStatus.CREATED);
	}

	public ResponseEntity<ResponseStructure<User>> getUser(int id) {
		User data = userDAO.getUser(id);
		ResponseStructure<User> rs = new ResponseStructure<User>();
		rs.setData(data);
		rs.setMessage("User Found Successfully");
		rs.setStatusCode(HttpStatus.FOUND.value());
		return new ResponseEntity<ResponseStructure<User>>(rs, HttpStatus.FOUND);
	}
}
