import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  const mockTeachers: Teacher[] = [
    { 
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    { 
      id: 2,
      lastName: 'Smith',
      firstName: 'Jane',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [TeacherService, HttpClient]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all teachers', () => {
    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should retrieve teacher details by id', () => {
    const teacherId = '1';
    service.detail(teacherId).subscribe((teacher) => {
      expect(teacher).toEqual(mockTeachers[0]);
    });

    const req = httpMock.expectOne(`${service['pathService']}/${teacherId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers[0]);
  });
});
