package com.pranav.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.pranav.DAO.CategoryDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Category;
import com.pranav.Exception.EmptyException;
import com.pranav.Exception.IdDoesNotPresentException;

@Service
public class CategoryService {
    @Autowired
    private CategoryDAO categoryDAO;

    public ResponseEntity<ResponseStructure<Category>> saveCategory(Category category) {
        Category data = categoryDAO.saveCategory(category);
        ResponseStructure<Category> rs = new ResponseStructure<>();
        rs.setData(data);
        rs.setMessage("Category Added Successfully");
        rs.setStatusCode(HttpStatus.CREATED.value());
        return new ResponseEntity<>(rs, HttpStatus.CREATED);
    }

    public ResponseEntity<ResponseStructure<Category>> getCategory(String name) {
        Category data = categoryDAO.findCategory(name);
        if (data != null) {
            ResponseStructure<Category> rs = new ResponseStructure<>();
            rs.setData(data);
            rs.setMessage("Category Found Successfully");
            rs.setStatusCode(HttpStatus.OK.value());
            return new ResponseEntity<>(rs, HttpStatus.OK);
        } else {
            throw new IdDoesNotPresentException("Category " + name + " does not exist!");
        }
    }

    public ResponseEntity<ResponseStructure<List<Category>>> getAllCategories() {
        List<Category> data = categoryDAO.findAllCategories();
        if (data != null && !data.isEmpty()) {
            ResponseStructure<List<Category>> rs = new ResponseStructure<>();
            rs.setData(data);
            rs.setMessage("Categories found successfully");
            rs.setStatusCode(HttpStatus.OK.value());
            return new ResponseEntity<>(rs, HttpStatus.OK);
        } else {
            throw new EmptyException("No categories found");
        }
    }

    public ResponseEntity<ResponseStructure<Category>> deleteCategory(String name) {
        Category data = categoryDAO.findCategory(name);
        if (data != null) {
            categoryDAO.deleteCategory(name);
            ResponseStructure<Category> rs = new ResponseStructure<>();
            rs.setData(null);
            rs.setMessage("Category " + name + " deleted successfully");
            rs.setStatusCode(HttpStatus.OK.value());
            return new ResponseEntity<>(rs, HttpStatus.OK);
        } else {
            throw new IdDoesNotPresentException("Category " + name + " does not exist.");
        }
    }
}
