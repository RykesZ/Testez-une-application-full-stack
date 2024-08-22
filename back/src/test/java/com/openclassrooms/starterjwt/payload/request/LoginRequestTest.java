package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class LoginRequestTest {

    private final Validator validator;

    public LoginRequestTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @Test
    public void testLoginRequestWithValidFields() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        assertTrue(violations.isEmpty(), "There should be no violations for valid fields.");
        assertEquals("test@example.com", loginRequest.getEmail());
        assertEquals("password123", loginRequest.getPassword());
    }

    @Test
    public void testLoginRequestWithBlankEmail() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("");
        loginRequest.setPassword("password123");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        assertFalse(violations.isEmpty(), "There should be a violation for blank email.");
        assertEquals(1, violations.size());

        ConstraintViolation<LoginRequest> violation = violations.iterator().next();
        assertEquals("email", violation.getPropertyPath().toString());
        assertEquals("ne doit pas être vide", violation.getMessage());
    }

    @Test
    public void testLoginRequestWithBlankPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        assertFalse(violations.isEmpty(), "There should be a violation for blank password.");
        assertEquals(1, violations.size());

        ConstraintViolation<LoginRequest> violation = violations.iterator().next();
        assertEquals("password", violation.getPropertyPath().toString());
        assertEquals("ne doit pas être vide", violation.getMessage());
    }

    @Test
    public void testLoginRequestWithBlankEmailAndPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("");
        loginRequest.setPassword("");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        assertFalse(violations.isEmpty(), "There should be violations for blank email and password.");
        assertEquals(2, violations.size());
    }

    @Test
    public void testLoginRequestGettersAndSetters() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("securepassword");

        assertEquals("user@example.com", loginRequest.getEmail());
        assertEquals("securepassword", loginRequest.getPassword());
    }
}
