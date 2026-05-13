package com.pranav.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pranav.DAO.AuthorDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Author;
import com.pranav.Exception.EmptyException;
import com.pranav.Exception.IdDoesNotPresentException;

@Service
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
		if (data != null) {
			ResponseStructure<Author> rs = new ResponseStructure<Author>();
			rs.setData(data);
			rs.setMessage("Author Found Successfully");
			rs.setStatusCode(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<Author>>(rs, HttpStatus.OK);
		} else {
			throw new IdDoesNotPresentException("Id " + id + " does not found");
		}
	}

	public ResponseEntity<ResponseStructure<List<Author>>> findAllAuthor() {
		List<Author> data = authorDAO.findAllAuthor();
		if (data != null) {
			ResponseStructure<List<Author>> rs = new ResponseStructure<List<Author>>();
			rs.setData(data);
			rs.setMessage("All Authors found successfully");
			rs.setStatusCode(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Author>>>(rs, HttpStatus.OK);
		} else {
			throw new EmptyException("No authors found");
		}
	}

	public ResponseEntity<ResponseStructure<Author>> deleteAuthor(int id) {
		Author data = authorDAO.findAuthor(id);
		if (data != null) {
			ResponseStructure<Author> rs = new ResponseStructure<Author>();
			authorDAO.deleteAuthor(id);
			rs.setData(null);
			rs.setMessage("Author having id" + id + " deleted successfully");
			rs.setStatusCode(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<Author>>(rs, HttpStatus.OK);
		} else {
			throw new IdDoesNotPresentException("Id" + id + " does not found");
		}
	}
}
