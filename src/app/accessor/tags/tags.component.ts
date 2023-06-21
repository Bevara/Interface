import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {

  constructor(public accessorsService : AccessorsService) { }
  
}
