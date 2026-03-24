import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService } from './data';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch repositories', () => {
    const mockRepos = [{ id: 1, name: 'Repo1' }];
    
    service.getRepositories().subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne('/assets/repositories.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });
});