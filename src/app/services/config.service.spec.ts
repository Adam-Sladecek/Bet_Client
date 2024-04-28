import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [ConfigService]
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve config data', () => {
    const mockConfigResponse = {
      sports: [
        {id:1, name: 'Tennis', selected: true}
      ],
      sportsBooks: [
        {id:1, name: 'Nike', selected: true}
      ]
    };
    service.getConfig().subscribe(config => {
      expect(config).toEqual(mockConfigResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'config/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfigResponse);
  });

  it('should set config data', () => {
    const mockConfigData = {
      sports: [
        {id:1, name: 'Tennis', selected: true}
      ],
      sportsBooks: [
        {id:1, name: 'Nike', selected: true}
      ]
    };
    service.setConfig(mockConfigData).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'config/set');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockConfigData);
    req.flush({'message': 'Configuration saved.'});
  });
});
