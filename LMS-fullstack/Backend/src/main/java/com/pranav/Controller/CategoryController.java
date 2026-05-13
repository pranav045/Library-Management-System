package com.pranav.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Category;
import com.pranav.Service.CategoryService;

@RestController("lmsCategoryController")
@CrossOrigin(origins = "*")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/saveCategory")
    public ResponseEntity<ResponseStructure<Category>> saveCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @GetMapping("/getCategory/{name}")
    public ResponseEntity<ResponseStructure<Category>> getCategory(@PathVariable String name) {
        return categoryService.getCategory(name);
    }

    @GetMapping("/getAllCategories")
    public ResponseEntity<ResponseStructure<List<Category>>> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @DeleteMapping("/deleteCategory/{name}")
    public ResponseEntity<ResponseStructure<Category>> deleteCategory(@PathVariable String name) {
        return categoryService.deleteCategory(name);
    }
}
