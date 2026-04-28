package com.pranav.DAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.Book;
import com.pranav.Repository.BookRepository;

@Repository
public class BookDAO {
	@Autowired
	private BookRepository bookRepository;

	public Book saveBook(Book book) {
		return bookRepository.save(book);
	}

	public Book getBook(int id) {
		return bookRepository.findById(id).orElse(null);
	}

	public boolean deleteBook(int id) {
		if (bookRepository.existsById(id)) {
			bookRepository.deleteById(id);
			return true;
		} else {
			return false;
		}
	}
}
