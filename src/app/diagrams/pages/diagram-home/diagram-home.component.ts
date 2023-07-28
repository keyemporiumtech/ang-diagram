import { Component } from '@angular/core';
import { EnumDiagramPage } from '../../enum/diagram-page.enum';
import { EnumFamilyTreeData } from '../../builder/family-tree/family-tree-data.enum';

@Component({
  selector: 'app-diagram-home',
  templateUrl: './diagram-home.component.html',
  styleUrls: ['./diagram-home.component.scss'],
})
export class DiagramHomeComponent {
  EnumDiagramPage = EnumDiagramPage;
  EnumFamilyTreeData = EnumFamilyTreeData;
}
