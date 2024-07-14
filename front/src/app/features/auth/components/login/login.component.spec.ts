import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { LoginRequest } from '../../interfaces/loginRequest.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;

  const mockSessionInfo: SessionInformation = {
    id: 1,
    token: 'mockToken',
    type: 'mockType',
    username: 'mockUsername',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  const mockAuthService = {
    login: jest.fn().mockReturnValue(of(mockSessionInfo)),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const fb: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useClass: SessionServiceMock },
        { provide: FormBuilder, useValue: fb },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    fixture.detectChanges();
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

    describe('password', () => {
      it('should be required', () => {
        const passwordControl = component.form.get('password');
        passwordControl?.setValue('');
        expect(passwordControl?.hasError('required')).toBeTruthy();
      });

      it('should be requiredwith minimum length of 3', () => {
        const passwordControl = component.form.get('password');
        passwordControl?.setValue('ab');
        expect(passwordControl?.hasError('minlength')).toBeTruthy();
      });
    });
  });

  describe('submit method', () => {
    it('should call SessionService logIn and navigate on successful login', () => {
      const logInSpy = jest
        .spyOn(sessionService, 'logIn')
        .mockImplementation(() => {});

      component.form.patchValue({
        email: 'test@example.com',
        password: 'password',
      });
      component.submit();

      expect(logInSpy).toHaveBeenCalledWith(mockSessionInfo);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true on login error', () => {
      jest
        .spyOn(mockAuthService, 'login')
        .mockReturnValue(throwError(() => new Error('Login error')));
      component.submit();
      expect(component.onError).toBeTruthy();
    });
  });
});

class SessionServiceMock {
  logIn(sessionInfo: SessionInformation): void {}
}
