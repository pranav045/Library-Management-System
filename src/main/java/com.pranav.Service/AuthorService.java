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

	public ResponseEntity<ResponseStructure<Author>> saveUser(Author author) {
		Author data = authorDAO.saveAuthor(author);
		ResponseStructure<Author> rs = new ResponseStructure<Author>();
		rs.setData(data);
		rs.setMessage("Book Added Successfully");
		rs.setStatusCode(HttpStatus.CREATED.value());
		return new ResponseEntity<ResponseStructure<Author>>(rs, HttpStatus.CREATED);
	}
}
