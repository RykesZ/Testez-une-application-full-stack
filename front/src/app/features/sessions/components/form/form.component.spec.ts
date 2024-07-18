import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { TeacherService } from '../../../../services/teacher.service';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { ActivatedRoute, Router } from '@angular/router';

import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let formBuilder: FormBuilder = new FormBuilder;

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'This is a test session description',
    date: new Date(),
    teacher_id: 2,
    users: [],
  };

  const mockSessionForm: FormGroup<any> = formBuilder.group({
    name: ['Test Session'],
    description: ['This is a test session description'],
    date: [new Date().toISOString().split('T')[0]],
    teacher_id: [2],
  });

  const mockSessionInformation: SessionInformation = {
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

  const mockRouter = { navigate: jest.fn(), url: '' };

  const mockMatSnackBar = { open: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
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
      declarations: [FormComponent]
    })
      .compileComponents();

    sessionService = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(FormComponent);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should navigate to sessions if user is not admin', () => {
      mockSessionInformation.admin = false;
      const router = TestBed.inject(Router);
      component.ngOnInit();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    })
    
    it('should call session detail if user is admin and updating', () => {
      mockSessionInformation.admin = true;
      mockRouter.url='update';
      const spy = jest.spyOn(component as any, 'initForm');
      (sessionApiService.detail as jest.Mock).mockReturnValue(of(mockSession));
      component.ngOnInit();
      fixture.detectChanges();
      expect(sessionApiService.detail).toHaveBeenCalledWith(mockActivatedRoute.snapshot.paramMap.get());
      expect(spy).toHaveBeenCalledWith(mockSession);
    })
    
    it('should init form if user is admin and not updating', () => {
      mockSessionInformation.admin = true;
      mockRouter.url='';
      const spy = jest.spyOn(component as any, 'initForm');
      component.ngOnInit();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith();
    })
  })

  describe('on submit', () => {
    beforeEach(() => {
      component.sessionForm = mockSessionForm;
    })
    
    it('should call create when is not on update, then call exit page', () => {
      component.onUpdate=false;
      (sessionApiService.create as jest.Mock).mockReturnValue(of(mockSession));
      const spyExitPage = jest.spyOn(component as any, 'exitPage');

      component.submit();
      fixture.detectChanges();
      expect(sessionApiService.create).toHaveBeenCalledWith(mockSessionForm.value);
      expect(spyExitPage).toHaveBeenCalledWith('Session created !');
    })
    
    it('should call update when is on update, then call exit page', () => {
      component.onUpdate=true;
      (component as any).id = '1';
      (sessionApiService.update as jest.Mock).mockReturnValue(of(mockSession));
      const spyExitPage = jest.spyOn(component as any, 'exitPage');

      component.submit();
      fixture.detectChanges();

      expect(sessionApiService.update).toHaveBeenCalledWith('1', mockSessionForm.value);
      expect(spyExitPage).toHaveBeenCalledWith('Session updated !');
    })

  })
  
  it('should show snackbar and navigate on successful exit page', () => {
    const snackBar = TestBed.inject(MatSnackBar);
    const router = TestBed.inject(Router);
    const message = "Session updated !"
    const spy = jest.spyOn(component as any, 'exitPage');

    component['exitPage'](message);
    expect(spy).toHaveBeenCalledWith(message);
    expect(snackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', {
      duration: 3000,
    });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  })
});
