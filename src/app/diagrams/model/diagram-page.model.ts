import { EnumFamilyTreeData } from '../builder/family-tree/family-tree-data.enum';
import { EnumKanbanBoardData } from '../builder/kanban-board/kanban-board-data.enum';
import { EnumOrgTreeData } from '../builder/org-tree/org-tree-data.enum';
import { EnumDiagramPage } from '../enum/diagram-page.enum';

export interface DiagramPageModel {
  page?: EnumDiagramPage;
  data?: EnumFamilyTreeData | EnumOrgTreeData | EnumKanbanBoardData;
}
