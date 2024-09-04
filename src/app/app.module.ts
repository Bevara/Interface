import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PreviewComponent } from './preview/preview.component';
import { DevelopComponent } from './develop/develop.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './modal/modal.component';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthComponent } from "./auth/auth.component";
import { AddComponent } from "./add/add.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    LoggerModule.forRoot({
        serverLoggingUrl: 'http://bevara.ddns.net:9090/logs',
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR,
        httpResponseType: 'text'
    }),
    AddComponent,
    PreviewComponent,
    ModalComponent,
    SideNavComponent,
    DevelopComponent,
    AuthComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
