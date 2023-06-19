import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PreviewComponent } from './preview/preview.component';
import { PreserveComponent } from './preserve/preserve.component';
import { DevelopComponent } from './develop/develop.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    PreviewComponent,
    PreserveComponent,
    DevelopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    CdkDropList, 
    CdkDrag,
    MatCardModule, 
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
