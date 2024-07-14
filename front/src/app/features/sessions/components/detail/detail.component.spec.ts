import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';

const mockSessionService = {
  sessionInformation: { id: 1, admin: true },
};

const mockSessionApiService = {
  detail: jest.fn(() => of({} as Session)), // Mock detail with empty session object
  delete: jest.fn(() => of({})), // Mock delete with empty observable
  participate: jest.fn(() => of({})), // Mock participate with empty observable
  unParticipate: jest.fn(() => of({})), // Mock unParticipate with empty observable
};

const mockTeacherService = {
  detail: jest.fn(() => of({} as Teacher)), // Mock teacher detail with empty teacher object
};

const mockActivatedRoute = {
  snapshot: { paramMap: { get: jest.fn(() => '1') } }, // Mock route param to be '1'
};

const mockRouter = { navigate: jest.fn() }; // Mock router navigate

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;

  const mockSessionService = {
    sessionInformation: {
      token: 'mock-token',
      type: 'mock-type',
      id: 1,
      username: 'mock-username',
      firstName: 'Mock',
      lastName: 'User',
      admin: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        FormBuilder,
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: jest.fn() }, // Mock MatSnackBar for now
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate session and teacher on successful fetch', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Test Session',
      description: 'This is a test session description',
      date: new Date(),
      teacher_id: 2,
      users: [],
    };
    const mockTeacher: Teacher = {
      id: 2,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fixture.detectChanges(); // Trigger change detection

    // Leverage existing mock for SessionService
    service.sessionInformation = mockSessionService.sessionInformation; // Set mock data for SessionService

    // Mock responses for detail calls (assuming services are injected)
    const sessionApiService = TestBed.inject(SessionApiService);
    const teacherService = TestBed.inject(TeacherService);
    spyOn(sessionApiService, 'detail').and.returnValue(of(mockSession));
    spyOn(teacherService, 'detail').and.returnValue(of(mockTeacher));

    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
    expect(component.isParticipate).toBeFalsy(); // User not participating initially
  });

  it('should call delete, show snackbar and navigate on successful delete', () => {
    const snackBar = TestBed.inject(MatSnackBar);
    const router = TestBed.inject(Router);

    // Mock delete response
    const sessionApiService = TestBed.inject(SessionApiService);
    spyOn(sessionApiService, 'delete').and.returnValue(of({}));

    component.delete();
    fixture.detectChanges();

    expect(sessionApiService.delete).toHaveBeenCalledWith('1'); // Verify delete call
    expect(snackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', {
      duration: 3000,
    });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']); // Verify router navigation
  });

  // Add tests for participate and unParticipate methods

  it('should back to previous page', () => {
    const spy = spyOn(window.history, 'back');

    component.back();

    expect(spy).toHaveBeenCalled;
  });
});
