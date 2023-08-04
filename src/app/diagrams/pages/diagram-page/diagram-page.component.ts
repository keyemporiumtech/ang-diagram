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
import { FamilyTreeProperties } from '../../builder/family-tree/properties/family-tree-properties';
import { OrgTreeProperties } from '../../builder/org-tree/properties/org-tree.properties';
import { SGP20Kanban } from '../../builder/kanban-board/datas/sgp-2.0';

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
      this.objModel.filename = 'GiuseppeFamily.png';
      const stateModel: ObjStateModel = {
        diagramNodeData: GiuseppeFamily.makeData(),
        diagramLinkData: GiuseppeFamily.makeLink(),
      };
      this.objModel.state = stateModel;
      this.objModel.title = 'Famiglia di Giuseppe';
      this.objModel.divId = 'myFamilyId';

      // properties
      const properties: FamilyTreeProperties = {
        typeShape: EnumFigureType.ARROTONDATO,
      };
      this.objProperties = properties;
    }
  }

  private loadOrg() {
    if (this.pageModel.data === EnumOrgTreeData.GIUSEPPE) {
      this.objModel.filename = 'GiuseppeOrg.png';
      const stateModel: ObjStateModel = {
        diagramNodeData: GiuseppeOrg.makeData(),
        diagramLinkData: GiuseppeOrg.makeLink(),
      };
      this.objModel.state = stateModel;
      this.objModel.title = 'Organizzazione di Giuseppe';
      this.objModel.divId = 'myOrgId';

      // properties
      const properties: OrgTreeProperties = {
        shape: { type: EnumFigureType.ARROTONDATO },
      };
      this.objProperties = properties;
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
    if (this.pageModel.data === EnumKanbanBoardData.SGP_2_0) {
      this.objModel.filename = 'SGP_2.0.png';
      const stateModel: ObjStateModel = {
        diagramNodeData: SGP20Kanban.makeData(),
        diagramLinkData: SGP20Kanban.makeLink(),
      };
      this.objModel.state = stateModel;
      this.objModel.title = 'Kanban SGP 2.0';
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
}
