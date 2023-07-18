import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevelopComponent } from './develop/develop.component';
import { AccessorComponent } from './accessor/accessor.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: 'preview',
    component: PreviewComponent
  },
  {
    path: 'accessor',
    component: AccessorComponent
  },
  {
    path: 'develop',
    component: DevelopComponent
  },
  {
    path: '**',
    redirectTo: '/preview', 
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
