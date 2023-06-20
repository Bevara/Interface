import { Component, inject, OnInit } from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { AccessorsService, Library } from '../services/accessors.service';

@Component({
  selector: 'app-accessor',
  templateUrl: './accessor.component.html',
  styleUrls: ['./accessor.component.scss']
})
export class AccessorComponent implements OnInit {

  constructor(public accessorsService : AccessorsService) { }

  ngOnInit(): void {
  }

}
