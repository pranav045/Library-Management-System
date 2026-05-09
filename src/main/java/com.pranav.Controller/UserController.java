package com.pranav.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.User;
import com.pranav.Service.UserService;

@RestController
public class UserController {
	@Autowired
	private UserService userService;

	@PostMapping("/saveUser")
	public ResponseEntity<ResponseStructure<User>> saveUser(@RequestBody User user) {
		return userService.saveUser(user);
	}

	@GetMapping("/getUser/{id}")
	public ResponseEntity<ResponseStructure<User>> getUser(@PathVariable int id) {
		return userService.getUser(id);
	}

	@GetMapping("/getAllUsers")
	public ResponseEntity<ResponseStructure<List<User>>> getAllUsers() {
		return userService.getAllUsers();
	}
}
