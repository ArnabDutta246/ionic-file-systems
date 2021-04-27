import { TestBed } from '@angular/core/testing';

import { FileDownloadUploadService } from './file-download-upload.service';

describe('FileDownloadUploadService', () => {
  let service: FileDownloadUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDownloadUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
