package com.pranav.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pranav.DAO.BookDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Book;
import com.pranav.Exception.EmptyException;
import com.pranav.Exception.IdDoesNotPresentException;

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
		if (data != null) {
			ResponseStructure<Book> rs = new ResponseStructure<Book>();
			rs.setData(data);
			rs.setMessage("Book Found Successfully");
			rs.setStatusCode(HttpStatus.FOUND.value());
			return new ResponseEntity<ResponseStructure<Book>>(rs, HttpStatus.FOUND);
		} else {
			throw new IdDoesNotPresentException("Id " + id + "does not present!");
		}
	}

	public ResponseEntity<ResponseStructure<List<Book>>> getAllBooks() {
		List<Book> data = bookDAO.getAllBooks();
		if (data != null) {
			ResponseStructure<List<Book>> rs = new ResponseStructure<List<Book>>();
			rs.setData(data);
			rs.setMessage("Books found successfully");
			rs.setStatusCode(HttpStatus.FOUND.value());
			return new ResponseEntity<ResponseStructure<List<Book>>>(rs, HttpStatus.FOUND);
		} else {
			throw new EmptyException("No books found");
		}
	}
}
