import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatRadioModule, MatExpansionModule, MatButtonModule, MatChipsModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule]
})

export class SourceComponent {
  validUrl = false;
  test_sequences = [['zoltan-tasi-CLJeQCr2F_A-unsplash.jxl', 'https://bevara.ddns.net/test-signals/JXL/red-room.jxl'], ['Canyon-5.1-48khz-448kbit.ac3', 'https://bevara.ddns.net/test-signals/ac3/Motivation.ac3'], ['trailer_1080p.ogg', 'https://bevara.ddns.net/test-signals/ogv/Big_Buck_Bunny_Trailer_400p.ogv']];
  url = "";

  importForm: FormGroup = new FormGroup({
    import_file: new FormControl('', [])
  });

  constructor(
    private el: ElementRef,
    public accessorsService: AccessorsService
  ) {
    accessorsService.src = this.test_sequences[0][1];
  }

  import(event?: any): void {
    if (event && event.target.files[0]) {
      this.accessorsService.filename = event.target.files[0].name;
      this.accessorsService.src = URL.createObjectURL(event.target.files[0]);
      this.accessorsService.source_option = 'local';
    } else {
      this.el.nativeElement.querySelector('#import_file').click();
    }
  }

  onSubmitURL() {
    try {
      new URL(this.url);
      this.validUrl = true;
      this.accessorsService.source_option = 'url';
      this.accessorsService.src = this.url;
    } catch (_) {
      this.validUrl = false;
    }
  }

  onSequenceChange(){
    this.accessorsService.source_option = 'test_sequence';
  }
}
