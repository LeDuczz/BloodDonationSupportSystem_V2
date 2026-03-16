package com.example.BloodDonationSupportSystem.exception;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseReponse<Object>> handleGeneralException(Exception ex) {
        ex.printStackTrace();
        BaseReponse<Object> response = new BaseReponse<>(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error" + ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<BaseReponse<Object>> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace();
        BaseReponse<Object> response = new BaseReponse<>(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Runtime Error: " + ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<BaseReponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        BaseReponse<Object> response = new BaseReponse<>(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseReponse<Map<String, String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(err.getField(), err.getDefaultMessage())
        );

        BaseReponse<Map<String, String>> response = new BaseReponse<>(
                HttpStatus.BAD_REQUEST.value(),
                "Dữ liệu không hợp lệ",
                errors
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<BaseReponse<Object>> handleBadRequest(BadRequestException ex) {
        return new ResponseEntity<>(
                new BaseReponse<>(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), null),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BaseReponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        BaseReponse<Object> response = new BaseReponse<>(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid argument: " + ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<BaseReponse<Object>> handleUnauthorizedException(UnauthorizedException ex) {
        BaseReponse<Object> response = new BaseReponse<>(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({AccessDeniedException.class, AuthenticationException.class})
    public void rethrowSecurityException(Exception ex) throws Exception {
        throw ex;
    }

}
