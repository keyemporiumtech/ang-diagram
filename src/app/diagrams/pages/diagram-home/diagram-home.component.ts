import { Component } from '@angular/core';
import { EnumDiagramPage } from '../../enum/diagram-page.enum';
import { EnumFamilyTreeData } from '../../builder/family-tree/family-tree-data.enum';
import { EnumOrgTreeData } from '../../builder/org-tree/org-tree-data.enum';
import { EnumKanbanBoardData } from '../../builder/kanban-board/kanban-board-data.enum';
import { EnumGanttData } from '../../builder/gantt/gantt-data.enum';

@Component({
  selector: 'app-diagram-home',
  templateUrl: './diagram-home.component.html',
  styleUrls: ['./diagram-home.component.scss'],
})
export class DiagramHomeComponent {
  EnumDiagramPage = EnumDiagramPage;
  EnumFamilyTreeData = EnumFamilyTreeData;
  EnumOrgTreeData = EnumOrgTreeData;
  EnumKanbanBoardData = EnumKanbanBoardData;
  EnumGanttData = EnumGanttData;
}
