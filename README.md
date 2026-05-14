# 📚 Library Management System (Java MVC + React)

A full-stack **Library Management System (LMS)** combining a **Java Spring Boot backend (MVC)** with a **React frontend**.  
This project demonstrates **CRUD operations**, **state management**, and a clean separation of concerns between backend and frontend.

---

## 🚀 Features

### Backend (Spring Boot MVC)
- **Add Book** → Insert new books into the library collection  
- **Remove Book** → Delete books by title  
- **Search Book** → Find books and check availability  
- **Display All Books** → List all books with status (Available/Borrowed)  
- **Borrow Book** → Mark a book as borrowed  
- **Return Book** → Mark a borrowed book as returned  
- **User Management** → Add, list, and delete users  
- **Author Management** → Add, list, and delete authors  

### Frontend (React)
- **Interactive UI** → User-friendly interface for managing books, authors, and users  
- **Book List View** → Display all books with availability status  
- **Search Functionality** → Search books by title/author  
- **Borrow/Return Actions** → Trigger backend operations via API calls  
- **Responsive Design** → Works across desktop and mobile  

---

## 🏗️ Project Structure

### Backend (Spring Boot MVC)
- **Model** → `Book.java`, `User.java`, `Author.java`  
- **Controller** → `BookController.java`, `UserController.java`, `AuthorController.java`  
- **Service** → Business logic for managing entities  
- **Repository** → JPA repositories for persistence  

### Frontend (React + Vite)

