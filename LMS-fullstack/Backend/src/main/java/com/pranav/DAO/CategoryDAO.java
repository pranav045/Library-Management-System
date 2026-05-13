package com.pranav.DAO;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.pranav.Entity.Category;
import com.pranav.Repository.CategoryRepository;

@Repository
public class CategoryDAO {
    @Autowired
    private CategoryRepository categoryRepository;

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category findCategory(String name) {
        return categoryRepository.findById(name).orElse(null);
    }

    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    public boolean deleteCategory(String name) {
        if (categoryRepository.existsById(name)) {
            categoryRepository.deleteById(name);
            return true;
        }
        return false;
    }
}
