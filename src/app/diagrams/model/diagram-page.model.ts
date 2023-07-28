import { EnumFamilyTreeData } from '../builder/family-tree/family-tree-data.enum';
import { EnumDiagramPage } from '../enum/diagram-page.enum';

export interface DiagramPageModel {
  page?: EnumDiagramPage;
  data?: EnumFamilyTreeData;
}
