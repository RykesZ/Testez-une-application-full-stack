package com.openclassrooms.starterjwt.security.jwt;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtUtils = new JwtUtils();
        // Using reflection to set private fields
        setField(jwtUtils, "jwtSecret", "testSecretKey");
        setField(jwtUtils, "jwtExpirationMs", 86400000); // 1 day in milliseconds
    }

    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testGenerateJwtToken() {
        // Arrange
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "username", "John", "Doe", false,"password");
        when(authentication.getPrincipal()).thenReturn(userDetails);

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertNotNull(token);
        assertTrue(token.startsWith("eyJ"));
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        // Arrange
        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000)) // 1 day in milliseconds
                .signWith(SignatureAlgorithm.HS512, "testSecretKey")
                .compact();

        // Act
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Assert
        assertEquals("username", username);
    }

    @Test
    public void testValidateJwtToken_ValidToken() {
        // Arrange
        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000)) // 1 day in milliseconds
                .signWith(SignatureAlgorithm.HS512, "testSecretKey")
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    public void testValidateJwtToken_InvalidSignature() {
        // Arrange
        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000)) // 1 day in milliseconds
                .signWith(SignatureAlgorithm.HS512, "wrongSecret")
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertFalse(isValid);
    }

    @Test
    public void testValidateJwtToken_ExpiredToken() {
        // Arrange
        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() - 1000)) // Expired token
                .signWith(SignatureAlgorithm.HS512, "testSecretKey")
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertFalse(isValid);
    }

    @Test
    public void testValidateJwtToken_MalformedToken() {
        // Act
        boolean isValid = jwtUtils.validateJwtToken("malformedToken");

        // Assert
        assertFalse(isValid);
    }
}

