import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ObjStateModel } from '../../../shared/model/obj-state.model';
import { GiuseppeFamily } from '../../builder/family-tree/giuseppe-family';
import { DiagramPageModel } from '../../model/diagram-page.model';
import { EnumDiagramPage } from '../../enum/diagram-page.enum';
import { EnumFamilyTreeData } from '../../builder/family-tree/family-tree-data.enum';
import { Location } from '@angular/common';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { Diagram } from 'gojs';
import { FamilyTreeTemplate } from '../../builder/family-tree/family-tree.template';
import { EnumFigureType } from '../../../shared/enum/figure-type.enum';
import { EnumOrgTreeData } from '../../builder/org-tree/org-tree-data.enum';
import { GiuseppeOrg } from '../../builder/org-tree/giuseppe-org';
import { OrgTreeTemplate } from '../../builder/org-tree/org-tree.template';

@Component({
  selector: 'app-diagram-page',
  templateUrl: './diagram-page.component.html',
  styleUrls: ['./diagram-page.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class DiagramPageComponent implements OnInit, AfterViewInit {
  data: ObjStateModel = {};
  pageModel: DiagramPageModel | any = {};
  filename: string | undefined;
  diagram: Diagram | undefined;
  title: string = '';

  EnumDiagramPage = EnumDiagramPage;
  @ViewChild('cmpDiagram') cmpDiagram: DiagramBaseComponent;

  constructor(private location: Location) {}

  ngOnInit() {
    this.pageModel = this.location.getState();
    this.loadPage();
  }

  ngAfterViewInit(): void {
    if (
      this.cmpDiagram &&
      this.cmpDiagram.myDiagramComponent &&
      this.cmpDiagram.myDiagramComponent.diagram &&
      this.diagram
    ) {
      this.cmpDiagram.myDiagramComponent.diagram = this.diagram;
    }
  }

  private loadPage() {
    switch (this.pageModel.page) {
      case EnumDiagramPage.FAMILY_TREE:
        this.loadFamily();
        break;
      case EnumDiagramPage.ORG_TREE:
        this.loadOrg();
        break;
    }
  }

  private loadFamily() {
    if (this.pageModel.data === EnumFamilyTreeData.GIUSEPPE) {
      this.data.diagramNodeData = GiuseppeFamily.makeData();
      this.data.diagramLinkData = GiuseppeFamily.makeLink();
      this.filename = 'GiuseppeFamily.png';
      this.diagram = FamilyTreeTemplate.makeTemplate(
        undefined,
        undefined,
        EnumFigureType.ARROTONDATO
      );
      this.title = 'Famiglia di Giuseppe';
    }
  }

  private loadOrg() {
    if (this.pageModel.data === EnumOrgTreeData.GIUSEPPE) {
      this.data.diagramNodeData = GiuseppeOrg.makeData();
      this.data.diagramLinkData = GiuseppeOrg.makeLink();
      this.filename = 'GiuseppeOrg.png';
      this.diagram = OrgTreeTemplate.makeTemplate();
      this.title = 'Organizzazione di Giuseppe';
    }
  }
}
