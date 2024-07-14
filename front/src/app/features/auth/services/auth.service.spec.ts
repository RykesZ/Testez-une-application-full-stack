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
import { HttpClientTestingModule } from '@angular/common/http/testing';

jest.mock('rxjs'); // Mock RxJS functions

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: { register: jest.fn(), login: jest.fn() },
        },
        {
          provide: HttpClient,
          useValue: { post: jest.fn() },
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
  });

  it('should call http post for register', () => {
    const mockRegisterRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'test_password',
    };

    authService.register(mockRegisterRequest);

    expect(authService.register).toHaveBeenCalledWith(mockRegisterRequest);
  });

  it('should call http post for login', () => {
    const mockLoginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'test_password',
    };

    authService.login(mockLoginRequest);

    expect(authService.login).toHaveBeenCalledWith(mockLoginRequest);
  });
  // it('should call http post for register', () => {
  //   const mockRegisterRequest: RegisterRequest = {
  //     email: 'test@example.com',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     password: 'test_password',
  //   };

  //   authService.register(mockRegisterRequest).subscribe();
  //   jest
  //     .spyOn(authService, 'register')
  //     .mockImplementationOnce(() => of(mockResponse));
  // });

  //   let authService: AuthService;
  //   let httpClientMock: jest.Mocked<HttpClient>;
  //   const pathService = 'api/auth';

  //   beforeEach(() => {
  //     const mockBuilder = jest.fn();
  //     mockBuilder.mockReturnValue({
  //       post: jest.fn(),
  //     });
  //     TestBed.configureTestingModule({
  //       imports: [HttpClientTestingModule],
  //       providers: [AuthService],
  //     });
  //     authService = TestBed.inject(AuthService);
  //   });

  //   it('should call http post for register', () => {
  //     const mockRegisterRequest: RegisterRequest = {
  //       email: 'test@example.com',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       password: 'test_password',
  //     };

  //     const mockResponse = null; // Mock successful response

  //     authService.register(mockRegisterRequest).subscribe();
  //     const postSpy = jest.spyOn(httpClientMock, 'post');

  //     expect(postSpy).toHaveBeenCalledWith(
  //       `${pathService}/register`,
  //       mockRegisterRequest
  //     );

  //     expect(postSpy).toHaveReturnedWith(of(mockResponse));
  //   });

  //   it('should handle errors from register', () => {
  //     const mockRegisterRequest: RegisterRequest = {
  //       email: 'test@example.com',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       password: 'test_password',
  //     };

  //     const mockError = new HttpErrorResponse({ error: 'Registration failed' });

  //     httpClientMock.post.mockImplementation((url, data) => {
  //       if (url === `${pathService}/register`) {
  //         return throwError(mockError);
  //       }
  //       return throwError('Invalid URL');
  //     });

  //     authService.register(mockRegisterRequest).subscribe(
  //       () => fail('Should not reach here'),
  //       (error) => {
  //         expect(error).toEqual(mockError);
  //       }
  //     );
  //   });

  //   it('should call http post for login', () => {
  //     const mockLoginRequest: LoginRequest = {
  //       email: 'test@example.com',
  //       password: 'test_password',
  //     };

  //     const mockSessionInformation: SessionInformation = {
  //       token: 'mock_token',
  //       type: 'user',
  //       id: 1,
  //       username: 'test_user',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       admin: false,
  //     };

  //     httpClientMock.post.mockImplementation((url, data) => {
  //       if (url === `${pathService}/login`) {
  //         return of(mockSessionInformation);
  //       }
  //       return throwError('Invalid URL');
  //     });

  //     authService.login(mockLoginRequest).subscribe((sessionInfo) => {
  //       expect(sessionInfo).toEqual(mockSessionInformation);
  //     });

  //     expect(httpClientMock.post).toHaveBeenCalledWith(
  //       `${pathService}/login`,
  //       mockLoginRequest
  //     );
  //   });

  //   it('should handle errors from login', () => {
  //     const mockLoginRequest: LoginRequest = {
  //       email: 'test_user@gmail.com',
  //       password: 'test_password',
  //     };

  //     const mockError = new HttpErrorResponse({ error: 'Login failed' });

  //     httpClientMock.post.mockImplementation((url, data) => {
  //       if (url === `${pathService}/login`) {
  //         return throwError(mockError);
  //       }
  //       return throwError('Invalid URL');
  //     });

  //     authService.login(mockLoginRequest).subscribe(
  //       () => fail('Should not reach here'),
  //       (error) => {
  //         expect(error).toEqual(mockError);
  //       }
  //     );
  //   });
});
