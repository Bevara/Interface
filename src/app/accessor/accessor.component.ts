import { Component, inject, OnInit } from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { AccessorsService} from '../services/accessors.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-accessor',
  templateUrl: './accessor.component.html',
  styleUrls: ['./accessor.component.scss']
})
export class AccessorComponent implements OnInit {
  public vscode = environment.vscode;
  
  constructor(public accessorsService : AccessorsService) { }

  ngOnInit(): void {
  }

}
