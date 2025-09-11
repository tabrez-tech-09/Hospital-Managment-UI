package com.hms.user.utility;

import com.hms.user.exception.HmsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionControllerAdvice {

    @Autowired
    private Environment environment;

    // ✅ Handles all generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorInfo> handleException(Exception e) {
        ErrorInfo errorInfo = new ErrorInfo();
        errorInfo.setErrorMessage(e.getMessage());
        errorInfo.setErrorCode(500); // Integer
        errorInfo.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(errorInfo, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ✅ Handles custom HmsException
    @ExceptionHandler(HmsException.class)
    public ResponseEntity<ErrorInfo> handleHmsException(HmsException e) {
        ErrorInfo errorInfo = new ErrorInfo();

        String errorMsg = environment.getProperty(e.getMessage(), e.getMessage());
        errorInfo.setErrorMessage(errorMsg);

        // if HmsException has no errorCode, fallback to 400
        errorInfo.setErrorCode(400);
        errorInfo.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
    }

    // ✅ Handles validation exceptions
    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<ErrorInfo> handleValidationExceptions(Exception e) {
        String errorMsg;

        if (e instanceof MethodArgumentNotValidException manv) {
            errorMsg = manv.getBindingResult().getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        } else {
            ConstraintViolationException cve = (ConstraintViolationException) e;
            errorMsg = cve.getConstraintViolations().stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
        }

        ErrorInfo errorInfo = new ErrorInfo();
        errorInfo.setErrorMessage("Validation failed: " + errorMsg);
        errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());
        errorInfo.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
    }
}



