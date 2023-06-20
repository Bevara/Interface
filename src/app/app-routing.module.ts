import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevelopComponent } from './develop/develop.component';
import { AccessorComponent } from './accessor/accessor.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: '',
    component: PreviewComponent
  },
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
