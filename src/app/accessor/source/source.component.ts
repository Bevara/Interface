import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})

export class SourceComponent {
  validUrl: boolean = false;
  
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
