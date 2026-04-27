package com.pranav.DAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.Author;
import com.pranav.Repository.AuthorRepository;

@Repository
public class AuthorDAO {
	@Autowired
	private AuthorRepository authorRepository;

	private Author saveAuthor(Author author) {
		return authorRepository.save(author);
	}

	private Author findAuthor(int id) {
		return authorRepository.findById(id).orElse(null);
	}

	private boolean deleteAuthor(int id) {
		if (authorRepository.existsById(id)) {
			authorRepository.deleteById(id);
			return true;
		} else {
			return false;
		}
	}
}
