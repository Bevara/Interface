import { Component, OnInit } from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.scss']
})
export class DevelopComponent implements OnInit {

  constructor(public accessorsService : AccessorsService,
    public router: Router) { }

  ngOnInit(): void {
  }

}
