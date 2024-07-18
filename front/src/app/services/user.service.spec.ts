import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    email: 'john.doe@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'securePassword',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [UserService, HttpClient]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user by id', () => {
    const userId = '1';
    service.getById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service['pathService']}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete user by id', () => {
    const userId = '1';
    service.delete(userId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['pathService']}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
