package com.hms.user.dto;

import com.hms.user.entity.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Email is mandatory")
    private String email;

    @Pattern(
        regexp = "^.{6}$",
        message = "Password must be exactly 6 characters long."
    )
    private String password;

    private Roles role;

    // ✅ JWT token (used only for responses)
    private String token;

    // ✅ Profile ID (linked with doctor/patient profile)
    private Long profileId;

    // Convert DTO → Entity
    public User toEntity() {
        return new User(this.id, this.name, this.email, this.password, this.role, this.profileId);
    }
    // Convert Entity → DTO
    public UserDTO toProfileDTO() {
    UserDTO dto = new UserDTO();
    dto.setName(this.name);
    dto.setEmail(this.email);
    dto.setRole(this.role);
    return dto;
}
}

