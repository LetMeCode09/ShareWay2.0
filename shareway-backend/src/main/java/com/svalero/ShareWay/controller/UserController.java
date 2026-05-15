package com.svalero.ShareWay.controller;

import com.svalero.ShareWay.domain.User;
import com.svalero.ShareWay.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    private final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /users
    @GetMapping
    public List<User> getAll() {
        logger.info("GET /users");
        return userService.getAllUsers();
    }

    // GET /users/{id}
    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        logger.info("GET /users/id ");
        return userService.getUserById(id);
    }

    // GET /users/email/{email}
    @GetMapping("/email/{email}")
    public User getByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    // GET /users/search?name=borja
    @GetMapping("/search")
    public List<User> searchByName(@RequestParam String name) {
        return userService.searchByName(name);
    }

    // POST /users
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User create(@Valid @RequestBody User user) {
        return userService.createUser(user);
    }

    // PUT /users/{id}
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // DELETE /users/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
