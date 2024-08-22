package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    private UserDetailsImpl userDetails;

    @BeforeEach
    public void setUp() {
        userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testUser")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("password")
                .build();
    }

    @Test
    public void testGetId() {
        assertEquals(1L, userDetails.getId());
    }

    @Test
    public void testGetUsername() {
        assertEquals("testUser", userDetails.getUsername());
    }

    @Test
    public void testGetFirstName() {
        assertEquals("John", userDetails.getFirstName());
    }

    @Test
    public void testGetLastName() {
        assertEquals("Doe", userDetails.getLastName());
    }

    @Test
    public void testIsAdmin() {
        assertTrue(userDetails.getAdmin());
    }

    @Test
    public void testGetPassword() {
        assertEquals("password", userDetails.getPassword());
    }

    @Test
    public void testGetAuthorities() {
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities instanceof HashSet);
    }

    @Test
    public void testIsAccountNonExpired() {
        assertTrue(userDetails.isAccountNonExpired());
    }

    @Test
    public void testIsAccountNonLocked() {
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired() {
        assertTrue(userDetails.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled() {
        assertTrue(userDetails.isEnabled());
    }

    @Test
    public void testEquals_SameObject() {
        assertTrue(userDetails.equals(userDetails));
    }

    @Test
    public void testEquals_DifferentObject() {
        assertFalse(userDetails.equals(new Object()));
    }

    @Test
    public void testEquals_NullObject() {
        assertFalse(userDetails.equals(null));
    }

    @Test
    public void testEquals_DifferentClass() {
        UserDetailsImpl otherUserDetails = UserDetailsImpl.builder()
                .id(2L)
                .username("anotherUser")
                .firstName("Jane")
                .lastName("Smith")
                .admin(false)
                .password("anotherPassword")
                .build();

        assertFalse(userDetails.equals(otherUserDetails));
    }

    @Test
    public void testEquals_SameId() {
        UserDetailsImpl sameIdUserDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testUser")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("password")
                .build();

        assertTrue(userDetails.equals(sameIdUserDetails));
    }
}
