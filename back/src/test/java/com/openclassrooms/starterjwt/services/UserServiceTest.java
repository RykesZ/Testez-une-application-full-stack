package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDelete() {
        // Appel de la méthode delete
        userService.delete(1L);

        // Vérifie que la méthode deleteById du repository a été appelée une fois avec le bon argument
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testFindById_UserExists() {
        User user = User.builder()
                .id(1L)
                .email("john.doe@example.com")
                .lastName("Doe")
                .firstName("John")
                .password("password")
                .admin(true)
                .build();

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        User foundUser = userService.findById(1L);

        assertNotNull(foundUser);
        assertEquals("john.doe@example.com", foundUser.getEmail());
        assertEquals("Doe", foundUser.getLastName());
        assertEquals("John", foundUser.getFirstName());
        assertEquals("password", foundUser.getPassword());
        assertTrue(foundUser.isAdmin());
    }

    @Test
    void testFindById_UserDoesNotExist() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        User foundUser = userService.findById(1L);

        assertNull(foundUser);
    }
}
