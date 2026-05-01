package com.pranav.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.pranav.DAO.AuthorDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Author;

public class AuthorService {
	@Autowired
	private AuthorDAO authorDAO;

	public ResponseEntity<ResponseStructure<Author>> saveAuthor(Author author) {
		Author data = authorDAO.saveAuthor(author);
		ResponseStructure<Author> rs = new ResponseStructure<Author>();
		rs.setData(data);
		rs.setMessage("Author Added Successfully");
		rs.setStatusCode(HttpStatus.CREATED.value());
		return new ResponseEntity<ResponseStructure<Author>>(rs, HttpStatus.CREATED);
	}

	public ResponseEntity<ResponseStructure<Author>> getAuthor(int id) {
		Author data = authorDAO.findAuthor(id);
		ResponseStructure<Author> rs = new ResponseStructure<Author>();
		rs.setData(data);
		rs.setMessage("Author Found Successfully");
		rs.setStatusCode(HttpStatus.FOUND.value());
		return new ResponseEntity<ResponseStructure<Author>>(rs, HttpStatus.FOUND);
	}
}
