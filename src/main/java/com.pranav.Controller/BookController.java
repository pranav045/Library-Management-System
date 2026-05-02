package com.pranav.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Book;
import com.pranav.Service.BookService;

@RestController
public class BookController {
	@Autowired
	private BookService bookService;

	@PostMapping("/saveBook")
	public ResponseEntity<ResponseStructure<Book>> saveBook(@RequestBody Book book) {
		return bookService.saveBook(book);
	}

	@GetMapping("/getAuthor/{id}")
	public ResponseEntity<ResponseStructure<Book>> getBook(@PathVariable int id) {
		return bookService.getBook(id);
	}
}
