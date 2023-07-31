import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GojsAngularModule } from 'gojs-angular';
import { FamilyTreeComponent } from './components/family-tree/family-tree.component';
import { SharedModule } from '../shared/shared.module';
import { DiagramPageComponent } from './pages/diagram-page/diagram-page.component';
import { DiagramsRoutingModule } from './diagrams-routing.module';
import { DiagramHomeComponent } from './pages/diagram-home/diagram-home.component';
import { OrgTreeComponent } from './components/org-tree/org-tree.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { GanttComponent } from './components/gantt/gantt.component';

@NgModule({
  declarations: [
    DiagramHomeComponent,
    DiagramPageComponent,
    FamilyTreeComponent,
    OrgTreeComponent,
    KanbanBoardComponent,
    GanttComponent,
  ],
  imports: [
    CommonModule,
    DiagramsRoutingModule,
    FormsModule,
    GojsAngularModule,
    SharedModule,
  ],
  exports: [
    DiagramHomeComponent,
    DiagramPageComponent,
    FamilyTreeComponent,
    OrgTreeComponent,
    KanbanBoardComponent,
    GanttComponent,
  ],
})
export class DiagramsModule {
  static forRoot() {
    return {
      ngModule: DiagramsModule,
      providers: [],
    };
  }
}
