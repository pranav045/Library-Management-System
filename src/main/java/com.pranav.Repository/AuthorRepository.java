package com.pranav.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.Author;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Integer> {

}
