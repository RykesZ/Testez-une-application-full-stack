package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TeacherMapperTest {

    private TeacherMapper teacherMapper;

    @BeforeEach
    public void setUp() {
        teacherMapper = Mappers.getMapper(TeacherMapper.class);
    }

    @Test
    public void testToEntity() {
        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        dto.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));

        Teacher teacher = teacherMapper.toEntity(dto);

        assertEquals(dto.getId(), teacher.getId());
        assertEquals(dto.getFirstName(), teacher.getFirstName());
        assertEquals(dto.getLastName(), teacher.getLastName());
        assertEquals(dto.getCreatedAt(), teacher.getCreatedAt());
        assertEquals(dto.getUpdatedAt(), teacher.getUpdatedAt());
    }

    @Test
    public void testToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        teacher.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));

        TeacherDto dto = teacherMapper.toDto(teacher);

        assertEquals(teacher.getId(), dto.getId());
        assertEquals(teacher.getFirstName(), dto.getFirstName());
        assertEquals(teacher.getLastName(), dto.getLastName());
        assertEquals(teacher.getCreatedAt(), dto.getCreatedAt());
        assertEquals(teacher.getUpdatedAt(), dto.getUpdatedAt());
    }

    @Test
    public void testToEntityList() {
        TeacherDto dto1 = new TeacherDto();
        dto1.setId(1L);
        dto1.setFirstName("John1");
        dto1.setLastName("Doe1");
        dto1.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        dto1.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));

        TeacherDto dto2 = new TeacherDto();
        dto2.setId(2L);
        dto2.setFirstName("John2");
        dto2.setLastName("Doe2");
        dto2.setCreatedAt(LocalDateTime.parse("2024-08-20T21:34:08"));
        dto2.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:34:08"));

        List<TeacherDto> dtoList = Arrays.asList(dto1, dto2);

        List<Teacher> teacherList = teacherMapper.toEntity(dtoList);

        assertEquals(dtoList.size(), teacherList.size());
        assertEquals(dtoList.get(0).getId(), teacherList.get(0).getId());
        assertEquals(dtoList.get(1).getFirstName(), teacherList.get(1).getFirstName());
    }

    @Test
    public void testToDtoList() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("John1");
        teacher1.setLastName("Doe1");
        teacher1.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        teacher1.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("John2");
        teacher2.setLastName("Doe2");
        teacher2.setCreatedAt(LocalDateTime.parse("2024-08-20T21:34:08"));
        teacher2.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:34:08"));

        List<Teacher> teacherList = Arrays.asList(teacher1, teacher2);

        List<TeacherDto> dtoList = teacherMapper.toDto(teacherList);

        assertEquals(teacherList.size(), dtoList.size());
        assertEquals(teacherList.get(0).getId(), dtoList.get(0).getId());
        assertEquals(teacherList.get(1).getFirstName(), dtoList.get(1).getFirstName());
    }
}
