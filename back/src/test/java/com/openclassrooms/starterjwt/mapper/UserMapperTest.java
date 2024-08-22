package com.openclassrooms.starterjwt.mapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    public void setUp() {
        userMapper = Mappers.getMapper(UserMapper.class);
    }

    @Test
    public void testToEntity() {
        UserDto dto = new UserDto();
        dto.setId(1L);
        dto.setEmail("test@example.com");
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setPassword("password");
        dto.setAdmin(true);
        dto.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        dto.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));

        User user = userMapper.toEntity(dto);

        assertEquals(dto.getId(), user.getId());
        assertEquals(dto.getEmail(), user.getEmail());
        assertEquals(dto.getFirstName(), user.getFirstName());
        assertEquals(dto.getLastName(), user.getLastName());
        assertEquals(dto.getPassword(), user.getPassword());
        assertEquals(dto.isAdmin(), user.isAdmin());
        assertEquals(dto.getCreatedAt(), user.getCreatedAt());
        assertEquals(dto.getUpdatedAt(), user.getUpdatedAt());
    }

    @Test
    public void testToDto() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password");
        user.setAdmin(true);
        user.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        user.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));

        UserDto dto = userMapper.toDto(user);

        assertEquals(user.getId(), dto.getId());
        assertEquals(user.getEmail(), dto.getEmail());
        assertEquals(user.getFirstName(), dto.getFirstName());
        assertEquals(user.getLastName(), dto.getLastName());
        assertEquals(user.getPassword(), dto.getPassword());
        assertEquals(user.isAdmin(), dto.isAdmin());
        assertEquals(user.getCreatedAt(), dto.getCreatedAt());
        assertEquals(user.getUpdatedAt(), dto.getUpdatedAt());
    }

    @Test
    public void testToEntityList() {
        UserDto dto1 = new UserDto();
        dto1.setId(1L);
        dto1.setEmail("test1@example.com");
        dto1.setFirstName("John1");
        dto1.setLastName("Doe1");
        dto1.setPassword("password1");
        dto1.setAdmin(true);

        UserDto dto2 = new UserDto();
        dto2.setId(2L);
        dto2.setEmail("test2@example.com");
        dto2.setFirstName("John2");
        dto2.setLastName("Doe2");
        dto2.setPassword("password2");
        dto2.setAdmin(false);

        List<UserDto> dtoList = Arrays.asList(dto1, dto2);

        List<User> userList = userMapper.toEntity(dtoList);

        assertEquals(dtoList.size(), userList.size());
        assertEquals(dtoList.get(0).getId(), userList.get(0).getId());
        assertEquals(dtoList.get(1).getEmail(), userList.get(1).getEmail());
    }

    @Test
    public void testToDtoList() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("test1@example.com");
        user1.setFirstName("John1");
        user1.setLastName("Doe1");
        user1.setPassword("password1");
        user1.setAdmin(true);

        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("test2@example.com");
        user2.setFirstName("John2");
        user2.setLastName("Doe2");
        user2.setPassword("password2");
        user2.setAdmin(false);

        List<User> userList = Arrays.asList(user1, user2);

        List<UserDto> dtoList = userMapper.toDto(userList);

        assertEquals(userList.size(), dtoList.size());
        assertEquals(userList.get(0).getId(), dtoList.get(0).getId());
        assertEquals(userList.get(1).getEmail(), dtoList.get(1).getEmail());
    }
}
