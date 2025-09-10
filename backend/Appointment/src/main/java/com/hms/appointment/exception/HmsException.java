package com.hms.appointment.exception;

public class HmsException extends Exception {
    private static final long serialVersionUID = 1L;

    private final Integer errorCode; // ✅ custom field

    public HmsException(String message) {
        super(message);
        this.errorCode = null; // default if not passed
    }

    public HmsException(String message, Integer errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public Integer getErrorCode() {
        return errorCode;
    }
}


