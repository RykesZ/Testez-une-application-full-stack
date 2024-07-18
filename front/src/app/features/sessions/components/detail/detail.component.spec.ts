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

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;

  const mockSessionInformation = {
    token: 'mock-token',
    type: 'mock-type',
    id: 1,
    username: 'mock-username',
    firstName: 'Mock',
    lastName: 'User',
    admin: true,
  };
  
  const mockSessionService = {
    sessionInformation: mockSessionInformation,
    $isLogged: jest.fn(() => of({} as boolean)),
    login: jest.fn(),
    logout: jest.fn(),
    next: jest.fn(),
  };
  
  const mockSessionApiService = {
    all: jest.fn(() => of([] as Session[])),
    detail: jest.fn(() => of({} as Session)),
    delete: jest.fn(() => of({} as any)),
    create: jest.fn(() => of({} as Session)),
    update: jest.fn(() => of({} as Session)),
    participate: jest.fn(() => of({})),
    unParticipate: jest.fn(() => of({})),
  };
  
  const mockTeacherService = {
    all: jest.fn(() => of([] as Teacher[])),
    detail: jest.fn(() => of({} as Teacher)),
  };
  
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn(() => '1') } },
  };
  
  const mockRouter = { navigate: jest.fn() };

  const mockMatSnackBar = { open: jest.fn() };

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
        { provide: MatSnackBar, useValue: jest.fn() },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchSession', () => {
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

    it('should call sessionApiService.detail and teacherService.detail on successful fetch', () => {
      (sessionApiService.detail as jest.Mock).mockReturnValue(of(mockSession));
      (teacherService.detail as jest.Mock).mockReturnValue(of(mockTeacher));

      component.ngOnInit();
      fixture.detectChanges();

      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
      expect(teacherService.detail).toHaveBeenCalledWith('2');
    })
  
    it('should populate session and teacher on successful fetch', () => {
      (sessionApiService.detail as jest.Mock).mockReturnValue(of(mockSession));
      (teacherService.detail as jest.Mock).mockReturnValue(of(mockTeacher));
      
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.session).toEqual(mockSession);
      expect(component.teacher).toEqual(mockTeacher);
    });
  })

  it('should call delete, show snackbar and navigate on successful delete', () => {
    const snackBar = TestBed.inject(MatSnackBar);
    const router = TestBed.inject(Router);

    (sessionApiService.delete as jest.Mock).mockReturnValue(of({}));

    component.delete();
    fixture.detectChanges();

    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', {
      duration: 3000,
    });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should call participate on successful participate', () => {
    (sessionApiService.participate as jest.Mock).mockReturnValue(of({}));

    component.participate();
    fixture.detectChanges();

    expect(sessionApiService.participate).toHaveBeenCalledWith(component.sessionId, component.userId);
  });
  
  
  it('should call unparticipate on successful unparticipate', () => {
    (sessionApiService.unParticipate as jest.Mock).mockReturnValue(of({}));

    component.unParticipate();
    fixture.detectChanges();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith(component.sessionId, component.userId);
  });


  it('should back to previous page', () => {
    const navigateSpy = jest.spyOn(window.history, 'back');

    component.back();

    expect(navigateSpy).toHaveBeenCalled;
  });
});
