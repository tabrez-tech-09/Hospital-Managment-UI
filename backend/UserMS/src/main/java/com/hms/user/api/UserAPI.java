package com.hms.user.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.hms.user.dto.ResponseDTO;
import com.hms.user.dto.UserDTO;
import com.hms.user.exception.HmsException;
import com.hms.user.service.UserService;
import com.hms.user.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Validated
@CrossOrigin
public class UserAPI {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil; // JWT utility

    // ✅ Register user
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO<UserDTO>> registerUser(@RequestBody @Valid UserDTO userDTO) throws HmsException {
        UserDTO savedUser = userService.registerUser(userDTO); // user saved
        return new ResponseEntity<>(
                ResponseDTO.success("Account created successfully", savedUser),
                HttpStatus.CREATED
        );
    }

    // ✅ Login user and return JWT
    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<UserDTO>> loginUser(@RequestBody UserDTO userDTO) throws HmsException {
        UserDTO loggedInUser = userService.loginUser(userDTO);

        // Generate JWT token using email
        String token = jwtUtil.generateToken(loggedInUser.getEmail());

        // Include token in response
        loggedInUser.setToken(token);

        return ResponseEntity.ok(
                ResponseDTO.success("Login successful", loggedInUser)
        );
    }
}



