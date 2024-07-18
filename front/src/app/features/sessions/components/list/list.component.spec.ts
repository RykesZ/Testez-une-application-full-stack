import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;


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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get session information on get user', () => {
    expect(component.user).toEqual(mockSessionInformation);
  })
});
