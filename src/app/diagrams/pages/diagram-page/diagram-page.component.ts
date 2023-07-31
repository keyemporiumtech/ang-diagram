import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ObjStateModel } from '../../../shared/model/obj-state.model';
import { GiuseppeFamily } from '../../builder/family-tree/datas/giuseppe-family';
import { DiagramPageModel } from '../../model/diagram-page.model';
import { EnumDiagramPage } from '../../enum/diagram-page.enum';
import { EnumFamilyTreeData } from '../../builder/family-tree/family-tree-data.enum';
import { Location } from '@angular/common';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { Diagram } from 'gojs';
import {
  FamilyTreeProperties,
  FamilyTreeTemplate,
} from '../../builder/family-tree/family-tree.template';
import { EnumFigureType } from '../../../shared/enum/figure-type.enum';
import { EnumOrgTreeData } from '../../builder/org-tree/org-tree-data.enum';
import { GiuseppeOrg } from '../../builder/org-tree/datas/giuseppe-org';
import { OrgTreeTemplate } from '../../builder/org-tree/org-tree.template';
import { EnumKanbanBoardData } from '../../builder/kanban-board/kanban-board-data.enum';
import { GenericKanban } from '../../builder/kanban-board/datas/generic-kanban';
import {
  KanbanBoardProperties,
  KanbanBoardTemplate,
} from '../../builder/kanban-board/kanban-board.template';
import { EnumGanttData } from '../../builder/gantt/gantt-data.enum';
import { GenericGantt } from '../../builder/gantt/datas/generic-gantt';
import { GanttTemplate } from '../../builder/gantt/gantt.template';
import { GanttComponent } from '../../components/gantt/gantt.component';

@Component({
  selector: 'app-diagram-page',
  templateUrl: './diagram-page.component.html',
  styleUrls: ['./diagram-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DiagramPageComponent implements OnInit, AfterViewInit {
  data: ObjStateModel = {};
  pageModel: DiagramPageModel | any = {};
  filename: string | undefined;
  diagram: Diagram | undefined;
  diagrams: Diagram[] | undefined;
  title: string = '';
  currentPage: EnumDiagramPage;

  EnumDiagramPage = EnumDiagramPage;
  @ViewChild('cmpDiagram') cmpDiagram: DiagramBaseComponent;
  @ViewChild('cmpGantt') cmpGantt: GanttComponent;
  @ViewChild('textJson') textJson: ElementRef;

  constructor(private location: Location) {}

  ngOnInit() {
    this.pageModel = this.location.getState();
    this.currentPage = this.pageModel.page;
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

  saveJson() {
    if (
      this.cmpDiagram &&
      this.cmpDiagram.myDiagramComponent &&
      this.cmpDiagram.myDiagramComponent.diagram
    ) {
      this.textJson.nativeElement.value = JSON.stringify(
        this.cmpDiagram.state,
        null,
        4
      );
    }
  }

  loadJson() {
    if (
      this.cmpDiagram &&
      this.cmpDiagram.myDiagramComponent &&
      this.cmpDiagram.myDiagramComponent.diagram
    ) {
      this.pageModel.page = null;
      const data = JSON.parse(this.textJson.nativeElement.value);

      const newData: ObjStateModel = {};
      newData.diagramNodeData = data.diagramNodeData;
      newData.diagramLinkData = data.diagramLinkData;
      this.data = newData;

      setTimeout(() => {
        this.pageModel.page = this.currentPage;
      }, 1000);
    }
  }

  /* ---------------  */
  private loadPage() {
    switch (this.pageModel.page) {
      case EnumDiagramPage.FAMILY_TREE:
        this.loadFamily();
        break;
      case EnumDiagramPage.ORG_TREE:
        this.loadOrg();
        break;
      case EnumDiagramPage.KANBAN_BOARD:
        this.loadKanban();
        break;
      case EnumDiagramPage.GANTT:
        this.loadGantt();
        break;
    }
  }

  private loadFamily() {
    if (this.pageModel.data === EnumFamilyTreeData.GIUSEPPE) {
      this.data.diagramNodeData = GiuseppeFamily.makeData();
      this.data.diagramLinkData = GiuseppeFamily.makeLink();
      this.filename = 'GiuseppeFamily.png';

      const propertiesTemplate: FamilyTreeProperties = {
        typeShape: EnumFigureType.ARROTONDATO,
      };
      this.diagram = FamilyTreeTemplate.makeTemplate(propertiesTemplate);
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

  private loadKanban() {
    if (this.pageModel.data === EnumKanbanBoardData.GENERIC) {
      this.data.diagramNodeData = GenericKanban.makeData();
      this.data.diagramLinkData = GenericKanban.makeLink();
      this.filename = 'GenericKanban.png';

      const propertiesTemplate: KanbanBoardProperties = {
        shapeGroup: { type: EnumFigureType.ARROTONDATO },
        textStatusCOMPLETE: { color: 'green' },
      };

      this.diagram = KanbanBoardTemplate.makeTemplate(propertiesTemplate);
      this.title = 'Kanban Generico';
    }
  }

  private loadGantt() {
    if (this.pageModel.data === EnumGanttData.GENERIC) {
      this.data.diagramNodeData = GenericGantt.makeData();
      this.data.diagramLinkData = GenericGantt.makeLink();
      this.filename = 'GenericGantt.png';

      const templatesGantt = GanttTemplate.makeTemplate();
      this.diagrams = [templatesGantt.task, templatesGantt.gantt];

      this.title = 'Gantt Generico';
    }
  }
}
