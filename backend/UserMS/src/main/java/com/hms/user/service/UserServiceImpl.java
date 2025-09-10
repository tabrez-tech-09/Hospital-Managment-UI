package com.hms.user.service;

import com.hms.user.entity.User;
import com.hms.user.clients.ProfileClient;
import com.hms.user.dto.Roles;
import com.hms.user.dto.UserDTO;
import com.hms.user.exception.HmsException;
import com.hms.user.repository.UserRepository;
import com.hms.user.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ApiService apiService;

    @Autowired
    private ProfileClient profileClient;

    /**
     * Register new user and return DTO with JWT token
     */
    @Override
public UserDTO registerUser(UserDTO userDTO) throws HmsException {
    Optional<User> opt = userRepository.findByEmail(userDTO.getEmail());
    if (opt.isPresent()) {
        throw new HmsException("User_with_this_email_already_exists");
    }

    // 1. Encode password
    String encodedPwd = passwordEncoder.encode(userDTO.getPassword());
    userDTO.setPassword(encodedPwd);

    // 2. Save user first
    User savedUser = userRepository.save(userDTO.toEntity());

    // 3. Create profile
    Long profileId = /*apiService.addProfile(userDTO);*/ null;
     if (userDTO.getRole().equals(Roles.DOCTOR)) {
            profileId = profileClient.addProfile(userDTO); 
        } else if (userDTO.getRole().equals(Roles.PATIENT)) {
            profileId = profileClient.addPatientProfile(userDTO);
        }


    // 4. Update profileId in DB
    savedUser.setProfileId(profileId);


    savedUser = userRepository.save(savedUser);  // ✅ re-save so profileId persists

    // 5. Generate JWT token
    String token = jwtUtil.generateToken(savedUser.getEmail());

    // 6. Convert entity → DTO (password null, token set)
    UserDTO responseDTO = savedUser.toDTO();
    responseDTO.setToken(token);

    return responseDTO;
}



    /**
     * Authenticate user login
     */
 @Override
public UserDTO loginUser(UserDTO userDTO) throws HmsException {
    User user = userRepository.findByEmail(userDTO.getEmail())
            .orElseThrow(() -> new HmsException("USER_NOT_FOUND"));

    if (!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
        throw new HmsException("INVALID_CREDENTIALS");
    }

    // ✅ Hide password from response
    //user.setPassword(null); // ye baad mai dekhenge

    UserDTO responseDTO = user.toDTO();
    responseDTO.setToken(jwtUtil.generateToken(user.getEmail()));

    return responseDTO;
}

    /**
     * Fetch user by ID
     */
    @Override
    public UserDTO getUserById(Long id) throws HmsException {
        return userRepository.findById(id)
                .orElseThrow(() -> new HmsException("User not found with id: " + id))
                .toDTO();
    }

    /**
     * Update user details
     */
    @Override
    public void updateUser(UserDTO userDTO) {
        // TODO: Implementation for updating user
    }
}
