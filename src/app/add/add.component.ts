import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from 'src/app/services/auth.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class ExistingAccessorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class CreateAccessorMatcher implements ErrorStateMatcher {
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

export function repoExistValidator(accessorsService: AccessorsService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return !accessorsService.repoExist ? { already_exist: { value: control.value } } : null;
  };
}

export function templateExistValidator(accessorsService: AccessorsService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return accessorsService.templateExist ? { templateDoesNotExist: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatTabsModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatProgressSpinnerModule, MatButton, MatIconModule, MatIconButton, MatSelectModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  existingAccessorFormControl = new FormControl('', [Validators.required, forbiddenNameValidator(/^https?:\/\/(www\.)?github\.com\//), templateExistValidator(this.accessorService)]);
  newAccessorFormControl = new FormControl('', [Validators.required, repoExistValidator(this.accessorService)]);

  existingAccessorMatcher = new ExistingAccessorMatcher();
  pending = false;
  url = "";
  releases: any = [];
  selected_release = "";
  status = "";
  new_filter_name = "";
  new_filter_type = "base_filter";

  constructor(public accessorService: AccessorsService,
    public authService: AuthService
  ) {
    this.accessorService.releaseList.subscribe(releases => {
      this.pending = false;
      this.releases = releases;
      this.selected_release = this.releases.length > 0 ? this.releases[0].id : "";
    });

    this.accessorService.newAccessorAdded.subscribe(status => {
      this.pending = false;
      this.status = status;

      if (status == "OK") {
        this.accessorService.showModalAdd = false;
      }
    });
  }
  ngOnInit(): void {
    vscode.postMessage({ type: 'checkIfForkExists', owner: "Bevara", repo: "base_filter", username: this.authService.owner });
  }

  // Replace with the owner and repo you're interested in
  owner = "bevara";
  repo = "avidmx";

  async listBranches(owner: string, repo: string) {
    this.pending = true;
    vscode.postMessage({ type: 'getReleases', owner: owner, repo: repo, release: this.selected_release });
  }

  checkout(owner: string, repo: string) {
    this.pending = true;
    const release = this.releases.find((x: any) => x.id == this.selected_release);
    vscode.postMessage({ type: 'addAccessor', owner: owner, repo: repo, release: release });
  }

  async submitExistingRepository() {
    if (!this.accessorService.templateExist || !this.url.startsWith("https://github.com/")) {
      return;
    }

    const end_url = this.url.replace("https://github.com/", "");
    const owner = end_url.split("/")[0];
    const repo = end_url.split("/")[1];

    if (this.selected_release != "") {
      this.checkout(owner, repo);
      return;
    }

    this.listBranches(owner, repo);
  }

  submitNewAccessor() {
    const fork_url = this.new_filter_type == "base_filter" ? "https://github.com/Bevara/base_filter" : this.url;
    if (!fork_url.startsWith("https://github.com/")) {
      return;
    }

    const end_url = fork_url.replace("https://github.com/", "");
    const owner = end_url.split("/")[0];
    const repo = end_url.split("/")[1];

    vscode.postMessage({ type: 'createAccessor', name: this.new_filter_name, owner: owner, repo: repo });
  }

  onChangeFilterName(event: Event) {
    // Get the new input value
    const newValue = (event.target as HTMLInputElement).value;
    vscode.postMessage({ type: 'checkIfRepoExists', owner: this.authService.owner, repo: newValue, isTemplate :false });
  }

  onChangeRepositoryUrl(event: Event) {
    // Get the new input value
    const newValue = (event.target as HTMLInputElement).value;
    if (!newValue.startsWith("https://github.com/")) {
      this.accessorService.templateExist = false;
      return;
    }

    const end_url = newValue.replace("https://github.com/", "");
    const owner = end_url.split("/")[0];
    const repo = end_url.split("/")[1];

    vscode.postMessage({ type: 'checkIfRepoExists', owner: owner, repo: repo, username :this.authService.owner });
    vscode.postMessage({ type: 'checkIfForkExists', owner: owner, repo: repo, username :this.authService.owner  });
  }

  openGitExtension() {
    vscode.postMessage({
      type: 'openExtension',
      name: 'vscode.git'
    });
  }
}
