package com.pranav.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
public class Profile {
	private String address;
	private String email;
	private String phone;
	@OneToOne(mappedBy = "profile")
	private User user;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

}

