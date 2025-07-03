package com.SynexiAI.inventor.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<String> handleDataIntegrity(DataIntegrityViolationException ex) {
    String msg = "Data integrity violation: " + ex.getRootCause().getMessage();
    return ResponseEntity
      .status(HttpStatus.CONFLICT)
      .body(msg);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<String> handleNotFound(RuntimeException ex) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(ex.getMessage());
  }
}
