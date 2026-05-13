package com.pranav.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Author;
import com.pranav.Service.AuthorService;

@RestController
public class AuthorController {
	@Autowired
	private AuthorService authorService;

	@PostMapping("/saveAuthor")
	public ResponseEntity<ResponseStructure<Author>> saveAuthor(@RequestBody Author author) {
		return authorService.saveAuthor(author);
	}

	@GetMapping("/getAuthor/{id}")
	public ResponseEntity<ResponseStructure<Author>> getAuthor(@PathVariable int id) {
		return authorService.getAuthor(id);
	}

	@GetMapping("/getAuthors")
	public ResponseEntity<ResponseStructure<List<Author>>> getAuthors() {
		return authorService.findAllAuthor();
	}

	@DeleteMapping("/deleteAuthor/{id}")
	public ResponseEntity<ResponseStructure<Author>> deleteAuthor(@PathVariable int id) {
		return authorService.deleteAuthor(id);
	}
}
