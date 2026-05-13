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
import com.pranav.Repository.AuthorRepository;
import com.pranav.Repository.CategoryRepository;
import com.pranav.Repository.UserRepository;
import com.pranav.Entity.Author;
import com.pranav.Entity.Category;
import com.pranav.Entity.User;
import java.util.ArrayList;
import java.util.stream.Collectors;


@Service
public class BookService {
	@Autowired
	private BookDAO bookDAO;

	@Autowired
	private AuthorRepository authorRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CategoryRepository categoryRepository;


	public ResponseEntity<ResponseStructure<Book>> saveBook(Book book) {
		Book bookToSave;
		
		// If book exists, load it to maintain persistence context
		Book existingBook = bookDAO.getBook(book.getId());
		if (existingBook != null) {
			bookToSave = existingBook;
			bookToSave.setName(book.getName());
			bookToSave.setStatus(book.getStatus());
		} else {
			bookToSave = book;
		}

		// Resolve Author
		if (book.getAuthor() != null) {
			Author author = authorRepository.findById(book.getAuthor().getId()).orElse(null);
			bookToSave.setAuthor(author);
		} else {
			bookToSave.setAuthor(null);
		}

		// Resolve User
		if (book.getUser() != null) {
			User user = userRepository.findById(book.getUser().getId()).orElse(null);
			bookToSave.setUser(user);
		} else {
			bookToSave.setUser(null);
		}

		// Resolve Categories
		if (book.getCategories() != null) {
			List<Category> resolvedCategories = new ArrayList<>();
			for (Category c : book.getCategories()) {
				if (c != null && c.getName() != null) {
					categoryRepository.findById(c.getName()).ifPresent(resolvedCategories::add);
				}
			}
			bookToSave.setCategories(resolvedCategories);
		} else {
			bookToSave.setCategories(new ArrayList<>());
		}

		Book data = bookDAO.saveBook(bookToSave);
		ResponseStructure<Book> rs = new ResponseStructure<Book>();
		rs.setData(data);
		rs.setMessage("Book Saved Successfully");
		rs.setStatusCode(HttpStatus.CREATED.value());
		return new ResponseEntity<ResponseStructure<Book>>(rs, HttpStatus.CREATED);
	}



	public ResponseEntity<ResponseStructure<Book>> getBook(int id) {
		Book data = bookDAO.getBook(id);
		if (data != null) {
			ResponseStructure<Book> rs = new ResponseStructure<Book>();
			rs.setData(data);
			rs.setMessage("Book Found Successfully");
			rs.setStatusCode(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<Book>>(rs, HttpStatus.OK);
		} else {
			throw new IdDoesNotPresentException("Id " + id + " does not present!");
		}
	}

	public ResponseEntity<ResponseStructure<List<Book>>> getAllBooks() {
		List<Book> data = bookDAO.getAllBooks();
		if (data != null) {
			ResponseStructure<List<Book>> rs = new ResponseStructure<List<Book>>();
			rs.setData(data);
			rs.setMessage("Books found successfully");
			rs.setStatusCode(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Book>>>(rs, HttpStatus.OK);
		} else {
			throw new EmptyException("No books found");
		}
	}

	public ResponseEntity<ResponseStructure<Book>> deleteBook(int id) {
		Book data = bookDAO.getBook(id);
		if (data != null) {
			bookDAO.deleteBook(id);
			ResponseStructure<Book> rs = new ResponseStructure<Book>();
			rs.setData(null);
			rs.setMessage("Book having id " + id + " deleted successfully");
			rs.setStatusCode(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<Book>>(rs, HttpStatus.OK);
		} else {
			throw new IdDoesNotPresentException("Id " + id + " does not present.");
		}
	}
}
