import { Component, inject, OnInit } from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import { LibsComponent } from './libs/libs.component';
import { TagsComponent } from './tags/tags.component';
import { LogsComponent } from './logs/logs.component';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  standalone:true,
  imports: [MatExpansionModule,LibsComponent, TagsComponent, LogsComponent],
})
export class OptionsComponent {

  constructor(public accessorsService : AccessorsService) { }

}
