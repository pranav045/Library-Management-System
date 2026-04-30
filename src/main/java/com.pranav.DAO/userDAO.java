package com.pranav.DAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.User;
import com.pranav.Repository.UserRepository;

@Repository
public class UserDAO {
	@Autowired
	private UserRepository userRepository;

	public User saveUser(User user) {
		return userRepository.save(user);
	}

	public User getUser(int id) {
		return userRepository.findById(id).orElse(null);
	}

	public boolean deleteUser(int id) {
		if (userRepository.existsById(id)) {
			userRepository.deleteById(id);
			return true;
		}
		return false;
	}

}
