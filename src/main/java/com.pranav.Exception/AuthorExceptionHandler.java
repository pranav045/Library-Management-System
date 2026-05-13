package com.pranav.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.pranav.DTO.ResponseStructure;

@ControllerAdvice
public class AuthorExceptionHandler {
	@ExceptionHandler(IdDoesNotPresentException.class)
	public ResponseEntity<ResponseStructure<String>> catchException(IdDoesNotPresentException exception) {
		ResponseStructure<String> rs = new ResponseStructure<String>();
		rs.setData(exception.getMessage());
		rs.setStatusCode(HttpStatus.NOT_FOUND.value());
		rs.setMessage("Author not found");
		return new ResponseEntity<ResponseStructure<String>>(rs, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(EmptyException.class)
	public ResponseEntity<ResponseStructure<String>> catchEmptyException(EmptyException exception) {
		ResponseStructure<String> rs = new ResponseStructure<String>();
		rs.setData(exception.getMessage());
		rs.setMessage("No Author found ");
		rs.setStatusCode(HttpStatus.NOT_FOUND.value());
		return new ResponseEntity<ResponseStructure<String>>(rs, HttpStatus.NOT_FOUND);
	}
}
