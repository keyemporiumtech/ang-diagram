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
import { EnumGanttData } from '../../builder/gantt/gantt-data.enum';
import { ObjDiagramModel } from '../../../shared/model/obj-diagram.model';
import { GenericGantt } from '../../builder/gantt/datas/generic-gantt';
import { GanttProperties } from '../../builder/gantt/properties/gantt.properties';
import { KanbanProperties } from '../../builder/kanban-board/properties/kanban.properties';

@Component({
  selector: 'app-diagram-page',
  templateUrl: './diagram-page.component.html',
  styleUrls: ['./diagram-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DiagramPageComponent implements OnInit, AfterViewInit {
  objModel: ObjDiagramModel;
  objProperties: any;

  data: ObjStateModel = {};
  pageModel: DiagramPageModel | any = {};
  diagram: Diagram | undefined;
  diagrams: Diagram[] | undefined;
  title: string = '';
  currentPage: EnumDiagramPage;

  EnumDiagramPage = EnumDiagramPage;
  @ViewChild('cmpDiagram') cmpDiagram: DiagramBaseComponent;
  @ViewChild('textJson') textJson: ElementRef;

  constructor(private location: Location) {
    this.objModel = new ObjDiagramModel();
  }

  ngOnInit() {
    this.pageModel = this.location.getState();
    this.currentPage = this.pageModel.page;
    this.loadPage();
  }

  ngAfterViewInit(): void {}

  download() {
    if (this.cmpDiagram) {
      this.cmpDiagram.download();
    }
  }
  saveJson() {
    if (this.cmpDiagram) {
      this.textJson.nativeElement.value = this.cmpDiagram.getJsonString();
    }
  }

  loadJson() {
    if (this.cmpDiagram) {
      this.pageModel.page = null;
      const data = JSON.parse(this.textJson.nativeElement.value);

      this.cmpDiagram.loadJson(data);

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
      // this.filename = 'GiuseppeFamily.png';

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
      // this.filename = 'GiuseppeOrg.png';
      this.diagram = OrgTreeTemplate.makeTemplate();
      this.title = 'Organizzazione di Giuseppe';
    }
  }

  private loadKanban() {
    if (this.pageModel.data === EnumKanbanBoardData.GENERIC) {
      this.objModel.filename = 'GenericKanban.png';
      const stateModel: ObjStateModel = {
        diagramNodeData: GenericKanban.makeData(),
        diagramLinkData: GenericKanban.makeLink(),
      };
      this.objModel.state = stateModel;
      this.objModel.title = 'Kanban Generico';
      this.objModel.divId = 'myKanbanId';

      // properties
      const properties: KanbanProperties = {
        shapeGroup: { type: EnumFigureType.ARROTONDATO },
        textStatusCOMPLETE: { color: 'green' },
      };
      this.objProperties = properties;
    }
  }

  private loadGantt() {
    if (this.pageModel.data === EnumGanttData.GENERIC) {
      this.objModel.filenames = ['MyTask.png', 'MyGantt.png'];
      const stateModel: ObjStateModel = {
        diagramModelData: {
          origin: new Date('1995-12-17T03:24:00'),
        },
        diagramNodeData: GenericGantt.makeData(),
        diagramLinkData: GenericGantt.makeLink(),
      };
      this.objModel.state = stateModel;
      this.objModel.title = 'Gantt Generico';

      // properties
      const properties: GanttProperties = {
        startDate: new Date('1995-12-17T03:24:00'),
      };
      this.objProperties = properties;
    }
  }

  convertDaysToUnits(n: any) {
    return n;
  }
}
