import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone : true,
  imports : [MatIconModule]
})
export class ModalComponent {
  @Output() clickOnClose = new EventEmitter();
  @Input() hideClose = false;
}
