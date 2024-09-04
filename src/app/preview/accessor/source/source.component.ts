import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss'],
  standalone:true,
  imports:[MatChipsModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatInputModule, FormsModule,ReactiveFormsModule]
})

export class SourceComponent {
  validUrl= false;

  source_option : 'url' | 'local' = 'url';

  importForm: FormGroup = new FormGroup({
    import_file: new FormControl('', [])
  });

  constructor(
    private el: ElementRef,
    public accessorsService : AccessorsService
  ) {

  }

  import(event?: any): void {
    if (event && event.target.files[0]) {
      this.accessorsService.src = URL.createObjectURL(event.target.files[0]);
      this.source_option = 'local';
    } else {
      this.el.nativeElement.querySelector('#import_file').click();
    }
  }
}
