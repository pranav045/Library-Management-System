package com.pranav.Entity;

import jakarta.persistence.Entity;

@Entity
public class Category {
	private String category;

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

}

