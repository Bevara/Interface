import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { vscode } from 'src/app/utilities/vscode';
import { AccessorsService } from 'src/app/services/accessors.service';
import { Octokit } from "@octokit/core";
import { MatSelectModule } from '@angular/material/select';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = !nameRe.test(control.value);
    return forbidden ? { githubName: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatTabsModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatProgressSpinnerModule, MatButton, MatIconModule, MatIconButton, MatSelectModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  accessorFormControl = new FormControl('', [Validators.required, forbiddenNameValidator(/^https?:\/\/(www\.)?github\.com\//)]);

  matcher = new MyErrorStateMatcher();
  pending = false;
  url = "";
  octokit = new Octokit();
  releases: any = [];
  selected_release = "";
  status = "";

  constructor(private accessorService: AccessorsService) {

  }

  // Replace with the owner and repo you're interested in
  owner = "bevara";
  repo = "avidmx";

  async listBranches(owner: string, repo : string) {
    this.pending = true;
    vscode.postMessage({ type: 'getReleases', owner: owner, repo:repo, release: this.selected_release });
    this.accessorService.releaseList.subscribe(releases => {
      this.pending = false;
      this.releases = releases;
      this.selected_release = this.releases.length > 0 ? this.releases[0].id : "";
      this.accessorService.releaseList.unsubscribe();
    });
  }

  checkout(owner:string, repo : string) {
    this.pending = true;
    const release = this.releases.find((x:any) => x.id == this.selected_release);
    vscode.postMessage({ type: 'addAccessor', owner: owner, repo:repo, release: release });
    this.accessorService.newAccessorAdded.subscribe(status => {
      this.pending = false;
      this.status = status;
      this.accessorService.newAccessorAdded.unsubscribe();

      if (status == "OK"){
        this.accessorService.showModalAdd = false;
      }
    });
  }

  async Submit() {
    if (!this.url.startsWith("https://github.com/")) {
      return;
    }

    const end_url = this.url.replace("https://github.com/", "");
    const owner = end_url.split("/")[0];
    const repo = end_url.split("/")[1];

    if (this.selected_release != "") {
      this.checkout(owner, repo);
      return ;
    }

    this.listBranches(owner, repo);
  }
}
