package com.pranav.Exception;

public class IdDoesNotPresentException extends RuntimeException {
	public String message;

	public IdDoesNotPresentException() {

	}

	public IdDoesNotPresentException(String message) {
		this.message = message;
	}

	@Override
	public String toString() {

		return message;
	}
}
