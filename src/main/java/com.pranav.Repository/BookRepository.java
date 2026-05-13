package com.pranav.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

}

