import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-diagram-page',
  templateUrl: './diagram-page.component.html',
  styleUrls: ['./diagram-page.component.scss'],
})
export class DiagramPageComponent implements OnInit, AfterViewInit {
  data: ObjStateModel = {};
  pageModel: DiagramPageModel | any = {};
  filename: string | undefined;
  diagram: Diagram | undefined;

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
    }
  }
}
