import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  const mockSessionInformation: SessionInformation = {
    token: 'mock-token',
    type: 'mock-type',
    id: 1,
    username: 'mock-username',
    firstName: 'Mock',
    lastName: 'User',
    admin: true,
  };

  const mockRegisterRequest: RegisterRequest = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'test_password',
  };

  const mockLoginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'test_password',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should call http post for register and return void on success', () => {
    authService.register(mockRegisterRequest).subscribe((res) => {
      expect(res).toBe(null);
    });
    const req = httpTestingController.expectOne(
      `${authService['pathService']}/register`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(null);
  });

  it('should call http post for login and return SessionInformation on success', () => {
    authService.login(mockLoginRequest).subscribe((response) => {
      expect(response).toEqual(mockSessionInformation);
    });

    const req = httpTestingController.expectOne(
      `${authService['pathService']}/login`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSessionInformation);
  });
});
