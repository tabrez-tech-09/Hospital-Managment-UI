package com.hms.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDTO<T> {
    private String status;
    private String message;
    private T data;

    // ✅ Success response
    public static <T> ResponseDTO<T> success(String message, T data) {
        return new ResponseDTO<>("SUCCESS", message, data);
    }

    // ✅ Failure response
    public static <T> ResponseDTO<T> failure(String message) {
        return new ResponseDTO<>("FAILURE", message, null);
    }
}

