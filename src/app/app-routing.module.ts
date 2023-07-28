import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'diagram',
    pathMatch: 'full',
  },
  {
    path: 'diagram',
    loadChildren: () =>
      import('./diagrams/diagrams.module').then((m) => m.DiagramsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
