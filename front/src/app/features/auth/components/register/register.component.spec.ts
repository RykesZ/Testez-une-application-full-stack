import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { HttpErrorResponse } from '@angular/common/http';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  const mockAuthService = {
    register: jest.fn().mockReturnValue(of(void 0)),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const fb: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: FormBuilder, useValue: fb },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    describe('email', () => {
      it('should be required', () => {
        const emailControl = component.form.get('email');
        emailControl?.setValue('');
        expect(emailControl?.hasError('required')).toBeTruthy();
      });

      it('should be required with valid email format', () => {
        const emailControl = component.form.get('email');
        emailControl?.setValue('invalidemail');
        expect(emailControl?.hasError('email')).toBeTruthy();
      });
    });

    describe('first name', () => {
      it('should be required', () => {
        const firstNameControl = component.form.get('firstName');
        firstNameControl?.setValue('');
        expect(firstNameControl?.hasError('required')).toBeTruthy();
      });

      it('should be required with minimum length of 3', () => {
        const firstNameControl = component.form.get('firstName');
        firstNameControl?.setValue('ab');
        expect(firstNameControl?.hasError('minlength')).toBeTruthy();
      });

      it('should be required with maximum length of 20', () => {
        const firstNameControl = component.form.get('firstName');
        firstNameControl?.setValue('a'.repeat(21));
        expect(firstNameControl?.hasError('maxlength')).toBeTruthy();
      });
    });

    describe('last name', () => {
      it('should be required', () => {
        const lastNameControl = component.form.get('lastName');
        lastNameControl?.setValue('');
        expect(lastNameControl?.hasError('required')).toBeTruthy();
      });

      it('should be required with minimum length of 3', () => {
        const lastNameControl = component.form.get('lastName');
        lastNameControl?.setValue('ab');
        expect(lastNameControl?.hasError('minlength')).toBeTruthy();
      });

      it('should be required with maximum length of 20', () => {
        const lastNameControl = component.form.get('lastName');
        lastNameControl?.setValue('a'.repeat(21));
        expect(lastNameControl?.hasError('maxlength')).toBeTruthy();
      });
    });

    describe('password', () => {
      it('should be required', () => {
        const passwordControl = component.form.get('password');
        passwordControl?.setValue('');
        expect(passwordControl?.hasError('required')).toBeTruthy();
      });

      it('should be required with minimum length of 3', () => {
        const passwordControl = component.form.get('password');
        passwordControl?.setValue('ab');
        expect(passwordControl?.hasError('minlength')).toBeTruthy();
      });

      it('should be required with maximum length of 40', () => {
        const passwordControl = component.form.get('password');
        passwordControl?.setValue('a'.repeat(41));
        expect(passwordControl?.hasError('maxlength')).toBeTruthy();
      });

      it('should have no error with valid password', () => {
        const passwordControl = component.form.get('password');
        passwordControl?.setValue('test!123456');
        expect(passwordControl?.hasError('')).toBeFalsy();
      });
    });
  });

  describe('submit method', () => {
    let registerRequest: RegisterRequest;
    beforeEach(() => {
      registerRequest = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };
    });
    it('should call authService.register', () => {
      component.form.patchValue(registerRequest);
      component.submit();
      expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
    });

    it('should navigate to "/login" on successful registration', () => {
      const navigateSpy = jest
        .spyOn(router, 'navigate')
        .mockResolvedValue(true);
      component.form.patchValue(registerRequest);
      component.submit();

      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should set onError to true on registration error', () => {
      jest
        .spyOn(authService, 'register')
        .mockReturnValue(
          throwError(
            () =>
              new HttpErrorResponse({ status: 500, statusText: 'Server Error' })
          )
        );
      component.submit();
      expect(component.onError).toBeTruthy();
    });
  });
});
