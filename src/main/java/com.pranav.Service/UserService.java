package com.pranav.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pranav.DAO.UserDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.User;
import com.pranav.Exception.EmptyException;
import com.pranav.Exception.IdDoesNotPresentException;

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
		if (data != null) {
			ResponseStructure<User> rs = new ResponseStructure<User>();
			rs.setData(data);
			rs.setMessage("Book Found Successfully");
			rs.setStatusCode(HttpStatus.FOUND.value());
			return new ResponseEntity<ResponseStructure<User>>(rs, HttpStatus.FOUND);
		} else {
			throw new IdDoesNotPresentException("Id" + id + " does not found");
		}
	}

	public ResponseEntity<ResponseStructure<List<User>>> getAllUsers() {
		List<User> data = userDAO.getAllUsers();
		if (data != null) {
			ResponseStructure<List<User>> rs = new ResponseStructure<List<User>>();
			rs.setData(data);
			rs.setMessage("Book Found Successfully");
			rs.setStatusCode(HttpStatus.FOUND.value());
			return new ResponseEntity<ResponseStructure<List<User>>>(rs, HttpStatus.FOUND);
		} else {
			throw new EmptyException("No users found");
		}
	}

	public ResponseEntity<ResponseStructure<User>> deleteUser(int id) {
		User data = userDAO.getUser(id);
		if (data != null) {
			ResponseStructure<User> rs = new ResponseStructure<User>();
			userDAO.deleteUser(id);
			rs.setData(null);
			rs.setMessage("User having id" + id + " deleted successfully");
			rs.setStatusCode(HttpStatus.FOUND.value());
			return new ResponseEntity<ResponseStructure<User>>(rs, HttpStatus.FOUND);
		} else {
			throw new IdDoesNotPresentException("Id" + id + " does not found");
		}
	}
}
