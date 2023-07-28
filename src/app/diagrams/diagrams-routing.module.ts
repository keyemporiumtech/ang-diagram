import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagramPageComponent } from './pages/diagram-page/diagram-page.component';
import { EnumDiagramPage } from './enum/diagram-page.enum';
import { EnumFamilyTreeData } from './builder/family-tree/family-tree-data.enum';
import { DiagramHomeComponent } from './pages/diagram-home/diagram-home.component';

const routes: Routes = [
  {
    path: '',
    component: DiagramHomeComponent,
  },
  {
    path: 'page',
    component: DiagramPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagramsRoutingModule {}
