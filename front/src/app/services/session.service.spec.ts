import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('$isLogged() should return initial value', () => {
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false); // Initial value of isLogged should be false
    });
  });

  it('logIn() should log in user', () => {
    const mockUser: SessionInformation = {
      token: 'mock-token',
      type: 'mock-type',
      id: 1,
      username: 'mock-username',
      firstName: 'Mock',
      lastName: 'User',
      admin: true,
    };

    service.logIn(mockUser);

    // Check if sessionInformation is set correctly
    expect(service.sessionInformation).toEqual(mockUser);

    // Check if isLogged is set to true
    expect(service.isLogged).toBe(true);

    // Check if $isLogged() emits true after login
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
    });
  });

  it('logOut() should log out user', () => {
    // First log in a user
    const mockUser: SessionInformation = {
      token: 'mock-token',
      type: 'mock-type',
      id: 1,
      username: 'mock-username',
      firstName: 'Mock',
      lastName: 'User',
      admin: true,
    };

    service.logIn(mockUser);

    // Then log out
    service.logOut();

    // Check if sessionInformation is set to undefined
    expect(service.sessionInformation).toBeUndefined();

    // Check if isLogged is set to false
    expect(service.isLogged).toBe(false);

    // Check if $isLogged() emits false after logout
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
    });
  });
});
