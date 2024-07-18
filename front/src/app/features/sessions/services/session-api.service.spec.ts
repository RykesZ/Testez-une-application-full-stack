import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'This is a test session description',
    date: new Date(),
    teacher_id: 2,
    users: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [SessionApiService]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all sessions', () => {
    service.all().subscribe((sessions) => {
      expect(sessions.length).toBe(1);
      expect(sessions).toEqual([mockSession]);
    });

    const req = httpMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('GET');
    req.flush([mockSession]);
  });

  it('should retrieve a session by id', () => {
    const sessionId = '1';
    service.detail(sessionId).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne(`${service['pathService']}/${sessionId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session by id', () => {
    const sessionId = '1';
    service.delete(sessionId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['pathService']}/${sessionId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create a new session', () => {
    service.create(mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  it('should update a session by id', () => {
    const sessionId = '1';
    service.update(sessionId, mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne(`${service['pathService']}/${sessionId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  it('should participate in a session', () => {
    const sessionId = '1';
    const userId = '1';
    service.participate(sessionId, userId).subscribe((res) => {
      expect(res).toBe(null);
    });

    const req = httpMock.expectOne(`${service['pathService']}/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should unParticipate from a session', () => {
    const sessionId = '1';
    const userId = '1';
    service.unParticipate(sessionId, userId).subscribe((res) => {
      expect(res).toBe(null);
    });

    const req = httpMock.expectOne(`${service['pathService']}/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
