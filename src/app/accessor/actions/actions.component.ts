import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';
import { DownloaderService } from 'src/app/services/downloader.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  constructor(public accessorsService : AccessorsService,
    public downloaderService:DownloaderService) { }
}
