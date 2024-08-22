package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.hamcrest.Matchers.matchesPattern;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Session session1;
    private SessionDto sessionDto;

    @BeforeEach
    void setUp() {
        session1 = new Session(1L, "Session 1", new Date(), "Description 1", null, null, LocalDateTime.now(), LocalDateTime.now());
        sessionDto = new SessionDto(1L, "Session 1", new Date(), 1L, "Description 1", null, LocalDateTime.now(), LocalDateTime.now());

        when(sessionService.getById(1L)).thenReturn(session1);
        when(sessionService.create(any(Session.class))).thenReturn(session1);
        when(sessionService.update(anyLong(), any(Session.class))).thenReturn(session1);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session1);
        doNothing().when(sessionService).delete(anyLong());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testFindById_SessionExists() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(sessionDto)));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testFindById_SessionDoesNotExist() throws Exception {
        when(sessionService.getById(99L)).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/99")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testFindAll() throws Exception {
        List<Session> sessions = Arrays.asList(session1);
        List<SessionDto> sessionDtos = Arrays.asList(sessionDto);

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(sessionDtos)));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testCreateSession() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(sessionDto)));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testUpdateSession() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Session 1"))
                .andExpect(jsonPath("$.date").value(matchesPattern("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}(Z|[+-]\\d{2}:\\d{2})")))
                .andExpect(jsonPath("$.teacher_id").value(1))
                .andExpect(jsonPath("$.description").value("Description 1"))
                .andExpect(jsonPath("$.users").value(Matchers.anyOf(Matchers.nullValue(), Matchers.isA(List.class))))
                .andExpect(jsonPath("$.createdAt").value(matchesPattern("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}")))
                .andExpect(jsonPath("$.updatedAt").value(matchesPattern("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}")));
    }


    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testDeleteSession() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testParticipate() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/1/participate/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    void testNoLongerParticipate() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/1/participate/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
