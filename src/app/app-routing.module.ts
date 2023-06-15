import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevelopComponent } from './develop/develop.component';
import { PreserveComponent } from './preserve/preserve.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: 'preview',
    component: PreviewComponent
  },
  {
    path: 'preserve',
    component: PreserveComponent
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
