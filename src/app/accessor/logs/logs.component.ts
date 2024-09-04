import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  standalone:true,
  imports:[MatChipsModule, MatListModule, MatRadioModule, MatFormFieldModule, FormsModule]
})
export class LogsComponent {
  constructor(public accessorsService : AccessorsService) {

  }
}
