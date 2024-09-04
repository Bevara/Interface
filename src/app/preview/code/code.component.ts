import { TextFieldModule } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccessorsService } from 'src/app/services/accessors.service';
import { ActionsComponent } from './actions/actions.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  standalone:true,
  imports:[MatInputModule, MatFormFieldModule, FormsModule, TextFieldModule, ActionsComponent]
})
export class CodeComponent {
  constructor(public accessorsService : AccessorsService) { }
}
