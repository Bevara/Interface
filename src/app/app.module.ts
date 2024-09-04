import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PreviewComponent } from './preview/preview.component';
import { AccessorComponent } from './accessor/accessor.component';
import { DevelopComponent } from './develop/develop.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AsyncPipe, NgFor } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { TagsComponent } from './accessor/tags/tags.component';
import { IntegrationComponent } from './preview/integration/integration.component';
import { SourceComponent } from './accessor/source/source.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './accessor/modal/modal.component';
import { LogsComponent } from './accessor/logs/logs.component';
import { UnusedComponent } from './preview/unused/unused.component';
import { GraphComponent } from './preview/graph/graph.component';
import { StatsComponent } from './preview/stats/stats.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { InfoComponent } from './preview/info/info.component';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthComponent } from "./auth/auth.component";
import { AddComponent } from "./accessor/add/add.component";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    MatExpansionModule,
    MatTableModule,
    CdkDropList,
    CdkDrag,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ClipboardModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    HttpClientModule,
    MatProgressSpinnerModule,
    LoggerModule.forRoot({
        serverLoggingUrl: 'http://bevara.ddns.net:9090/logs',
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR,
        httpResponseType: 'text'
    }),
    AddComponent,
    AccessorComponent,
    LogsComponent,
    SourceComponent,
    TagsComponent,
    IntegrationComponent,
    UnusedComponent,
    StatsComponent,
    InfoComponent,
    GraphComponent,
    PreviewComponent,
    ModalComponent,
    SideNavComponent,
    DevelopComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
