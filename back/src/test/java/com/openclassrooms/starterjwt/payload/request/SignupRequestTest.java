package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class SignupRequestTest {

    private final Validator validator;

    public SignupRequestTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @Test
    public void testSignupRequestWithValidFields() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertTrue(violations.isEmpty(), "There should be no violations for valid fields.");
        assertEquals("test@example.com", signupRequest.getEmail());
        assertEquals("John", signupRequest.getFirstName());
        assertEquals("Doe", signupRequest.getLastName());
        assertEquals("password123", signupRequest.getPassword());
    }

    @Test
    public void testSignupRequestWithInvalidEmail() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("invalid-email");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertFalse(violations.isEmpty(), "There should be a violation for an invalid email.");
        assertEquals(1, violations.size());

        ConstraintViolation<SignupRequest> violation = violations.iterator().next();
        assertEquals("email", violation.getPropertyPath().toString());
        assertEquals("doit être une adresse électronique syntaxiquement correcte", violation.getMessage());
    }

    @Test
    public void testSignupRequestWithBlankFields() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("");
        signupRequest.setFirstName("");
        signupRequest.setLastName("");
        signupRequest.setPassword("");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertFalse(violations.isEmpty(), "There should be violations for blank fields.");
        assertEquals(7, violations.size());
    }

    @Test
    public void testSignupRequestWithShortFirstName() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("Jo");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertFalse(violations.isEmpty(), "There should be a violation for a short first name.");
        assertEquals(1, violations.size());

        ConstraintViolation<SignupRequest> violation = violations.iterator().next();
        assertEquals("firstName", violation.getPropertyPath().toString());
        assertEquals("la taille doit être comprise entre 3 et 20", violation.getMessage());
    }

    @Test
    public void testSignupRequestWithLongPassword() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("thispasswordiswaytoolongandshouldfailvalidation");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        assertFalse(violations.isEmpty(), "There should be a violation for a long password.");
        assertEquals(1, violations.size());

        ConstraintViolation<SignupRequest> violation = violations.iterator().next();
        assertEquals("password", violation.getPropertyPath().toString());
        assertEquals("la taille doit être comprise entre 6 et 40", violation.getMessage());
    }

    @Test
    public void testSignupRequestGettersAndSetters() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("user@example.com");
        signupRequest.setFirstName("Jane");
        signupRequest.setLastName("Smith");
        signupRequest.setPassword("securepassword");

        assertEquals("user@example.com", signupRequest.getEmail());
        assertEquals("Jane", signupRequest.getFirstName());
        assertEquals("Smith", signupRequest.getLastName());
        assertEquals("securepassword", signupRequest.getPassword());
    }
}
