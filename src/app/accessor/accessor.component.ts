import { Component, inject, OnInit } from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { AccessorsService} from '../services/accessors.service';
import { environment } from './../../environments/environment';
import {MatExpansionModule} from '@angular/material/expansion';
import { LibsComponent } from './libs/libs.component';
import { SourceComponent } from './source/source.component';
import { TagsComponent } from './tags/tags.component';
import { LogsComponent } from './logs/logs.component';

@Component({
  selector: 'app-accessor',
  templateUrl: './accessor.component.html',
  styleUrls: ['./accessor.component.scss'],
  standalone:true,
  imports: [MatExpansionModule,LibsComponent, SourceComponent, TagsComponent, LogsComponent],
})
export class AccessorComponent implements OnInit {
  public vscode = environment.vscode;

  constructor(public accessorsService : AccessorsService) { }

  ngOnInit(): void {
  }

}
