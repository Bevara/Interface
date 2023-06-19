import { Component, inject, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { AccessorsService, Library } from '../services/accessors.service';

@Component({
  selector: 'app-preserve',
  templateUrl: './preserve.component.html',
  styleUrls: ['./preserve.component.scss']
})
export class PreserveComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public accessorsService : AccessorsService) { }

  ngOnInit(): void {
  }

}