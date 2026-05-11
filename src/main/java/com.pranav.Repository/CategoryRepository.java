package com.pranav.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

}
