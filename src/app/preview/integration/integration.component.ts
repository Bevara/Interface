import { TextFieldModule } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccessorsService } from 'src/app/services/accessors.service';
import { ActionsComponent } from './actions/actions.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
  standalone:true,
  imports:[MatInputModule, MatFormFieldModule, FormsModule, TextFieldModule, ActionsComponent]
})
export class IntegrationComponent {
  constructor(public accessorsService : AccessorsService) { }
}
