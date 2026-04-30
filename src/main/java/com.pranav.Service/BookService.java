package com.pranav.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pranav.DAO.BookDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Book;

@Service
public class BookService {
	@Autowired
	private BookDAO bookDAO;

	public ResponseEntity<ResponseStructure<Book>> saveBook(Book book) {
		Book data = bookDAO.saveBook(book);
		ResponseStructure<Book> rs = new ResponseStructure<Book>();
		rs.setData(data);
		rs.setMessage("Book Added Successfully");
		rs.setStatusCode(HttpStatus.CREATED.value());
		return new ResponseEntity<ResponseStructure<Book>>(rs, HttpStatus.CREATED);
	}

	public ResponseEntity<ResponseStructure<Book>> getBook(int id) {
		Book data = bookDAO.getBook(id);
		ResponseStructure<Book> rs = new ResponseStructure<Book>();
		rs.setData(data);
		rs.setMessage("Book Found Successfully");
		rs.setStatusCode(HttpStatus.FOUND.value());
		return new ResponseEntity<ResponseStructure<Book>>(rs, HttpStatus.FOUND);
	}
}
