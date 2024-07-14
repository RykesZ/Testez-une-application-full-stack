import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { MeComponent } from './me.component';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'john.doe@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: true,
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch user by id from UserService', () => {
      component.ngOnInit();
      expect(mockUserService.getById).toHaveBeenCalledWith('1');
    });

    it('should assign fetched user to component.user', () => {
      component.ngOnInit();
      expect(component.user).toEqual(mockUser);
    });
  });

  describe('back method', () => {
    it('should call window.history.back', () => {
      const spy = jest.spyOn(window.history, 'back');
      component.back();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('delete method', () => {
    it('should call UserService delete method with correct id', () => {
      component.delete();
      expect(mockUserService.delete).toHaveBeenCalledWith('1');
    });

    it('should open MatSnackBar with delete confirmation message', () => {
      component.delete();
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
    });

    it('should call SessionService logOut method', () => {
      component.delete();
      expect(mockSessionService.logOut).toHaveBeenCalled();
    });

    it('should navigate to home page', () => {
      component.delete();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
