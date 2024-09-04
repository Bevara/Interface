import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  standalone:true,
  imports:[MatChipsModule]
})
export class TagsComponent {

  constructor(public accessorsService : AccessorsService) { }

}
