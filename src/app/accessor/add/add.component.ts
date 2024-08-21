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
  branches: string[] = [];
  selected_branch = "";
  status = "";

  constructor(private accessorService: AccessorsService) {

  }

  // Replace with the owner and repo you're interested in
  owner = "bevara";
  repo = "avidmx";

  async listBranches(url: string) {
    try {
      this.pending = true;
      const response = await this.octokit.request(`/repos/${url}/branches`);
      this.pending = false;
      console.log("Branches:", response);
      return response.data.map((x: any) => x.name);
    } catch (error) {
      this.pending = false;
      console.error("Error fetching branches:", error);
      return [];
    }
  }

  checkout(url:string) {
    const owner = url.split("/")[0];
    const repo = url.split("/")[1];
    this.pending = true;
    vscode.postMessage({ type: 'addAccessor', owner: owner, repo:repo, branch: this.selected_branch });
    this.accessorService.newAccessorAdded.subscribe(status => {
      this.pending = false;
      this.status = status;
      this.accessorService.newAccessorAdded.unsubscribe();
    });
  }

  async Submit() {
    if (!this.url.startsWith("https://github.com/")) {
      return;
    }

    const end_url = this.url.replace("https://github.com/", "");

    if (this.selected_branch != "") {
      this.checkout(end_url);
      return ;
    }

    this.branches = await this.listBranches(end_url);
    this.selected_branch = this.branches.length > 0 ? this.branches[0] : "";
  }
}
