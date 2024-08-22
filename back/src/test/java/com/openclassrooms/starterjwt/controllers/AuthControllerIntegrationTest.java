package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import javax.transaction.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testRegisterUserSuccess() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("User registered successfully!"));

        // Additional check to ensure the user was saved in the repository
        assert(userRepository.existsByEmail("newuser@example.com"));
    }

    @Test
    public void testRegisterUserEmailAlreadyExists() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("existinguser@example.com");
        signupRequest.setFirstName("Jane");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        // Pre-save a user with the same email
        userRepository.save(new User(signupRequest.getEmail(), signupRequest.getLastName(), signupRequest.getFirstName(),
                "encoded_password", false));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Test
    public void testAuthenticateUserSuccess() throws Exception {
        // Utilisation du PasswordEncoder pour encoder le mot de passe avant de sauvegarder l'utilisateur
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Pré-enregistrement d'un utilisateur pour l'authentification
        User user = new User("loginuser@example.com", "Doe", "John", encodedPassword, false);
        userRepository.save(user);

        // Création de la requête de connexion
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("loginuser@example.com");
        loginRequest.setPassword(rawPassword);  // Utilisation du mot de passe brut

        // Exécution de la requête et vérification des résultats
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())  // Vérification du statut HTTP 200
                .andExpect(jsonPath("$.token").exists())  // Vérification de l'existence du token JWT dans la réponse
                .andExpect(jsonPath("$.id").value(user.getId()))  // Vérification de l'ID de l'utilisateur
                .andExpect(jsonPath("$.username").value(user.getEmail()))  // Vérification de l'email de l'utilisateur
                .andExpect(jsonPath("$.firstName").value(user.getFirstName()))  // Vérification du prénom
                .andExpect(jsonPath("$.lastName").value(user.getLastName()))  // Vérification du nom de famille
                .andExpect(jsonPath("$.admin").value(false));  // Vérification du statut admin
    }

    @Test
    public void testAuthenticateUserInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
