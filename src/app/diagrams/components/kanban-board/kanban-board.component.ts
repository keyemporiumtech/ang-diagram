import * as go from 'gojs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { KanbanBoardTemplate } from '../../builder/kanban-board/kanban-board.template';
import { KanbanModel } from '../../model/kanban.model';
import { ObjStateModel } from '../../../shared/model/obj-state.model';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent extends DiagramBaseComponent<KanbanModel> {
  // form insert
  @ViewChild('inputTitle') inputTitle: ElementRef<any>;
  @ViewChild('inputStart') inputStart: ElementRef<any>;
  @ViewChild('inputEnd') inputEnd: ElementRef<any>;
  @ViewChild('inputDuration') inputDuration: ElementRef<any>;
  @ViewChild('selectStatus') selectStatus: ElementRef<any>;
  @ViewChild('inputPercent') inputPercent: ElementRef<any>;

  constructor() {
    super();
  }

  override ngAfterViewInit(): void {
    setTimeout(() => {
      const myModel = this.getModel();
      this.diagram = KanbanBoardTemplate.make(
        this.divId,
        this.diagramProperties
      );
      this.diagram.model = myModel;

      if (this.diagramModel.state && this.diagramModel.state.diagramNodeData) {
        this.diagramModel.state.diagramNodeData.forEach((el) => {
          if (el.isGroup) {
            this.recalcPercent(el.key);
          }
        });
      }
    }, 1000);
  }

  override afterModel(state: ObjStateModel): void {}

  override getModel(): go.GraphLinksModel {
    return this.defaultModel();
  }

  override keepDataDetailFromEvent(data: KanbanModel): void {}
  override keepDataUpdateFromEvent(data: KanbanModel): void {
    if (data && data.text && this.inputTitle) {
      this.inputTitle.nativeElement.value = data.text;
    } else if (this.inputTitle) {
      this.inputTitle.nativeElement.value = undefined;
    }
    if (data && data.start && this.inputStart) {
      this.inputStart.nativeElement.value = this.formatDate(data.start);
    } else if (this.inputTitle) {
      this.inputStart.nativeElement.value = undefined;
    }
    if (data && data.end && this.inputEnd) {
      this.inputEnd.nativeElement.value = this.formatDate(data.end);
    } else if (this.inputTitle) {
      this.inputEnd.nativeElement.value = undefined;
    }
    if (this.inputDuration) {
      this.inputDuration.nativeElement.value = this.calcDuration(
        data.start,
        data.end
      );
    }
    if (data && data.color && this.selectStatus) {
      this.selectStatus.nativeElement.value = data.color;
    } else if (this.inputTitle) {
      this.selectStatus.nativeElement.value = '0';
    }

    if (data && data.percent && this.inputPercent) {
      this.inputPercent.nativeElement.value = data.percent;
    } else if (this.inputPercent) {
      this.inputEnd.nativeElement.value = undefined;
    }
  }

  override keepDataSaveFromEvent(data: KanbanModel): void {}

  override validateForm(): void {}

  override saveModel(): void {
    const dataSelected: KanbanModel = this.modalShared.getDataDetail();
    const modelSave: KanbanModel = this.getModelByForm();
    modelSave.group = dataSelected.group;
    this.saveModelCommit(modelSave);
    this.recalcPercent(modelSave.group);
  }
  override updateModel(): void {
    const dataSelected: KanbanModel = this.modalShared.getDataUpdate();
    const modelSave: KanbanModel = this.getModelByForm();
    modelSave.key = dataSelected.key;
    modelSave.group = dataSelected.group;
    this.updateModelCommit(modelSave);
    this.recalcPercent(modelSave.group);
  }
  override getModelByForm(): KanbanModel {
    const modelSave: KanbanModel = {
      key: undefined,
      text: this.inputTitle.nativeElement.value,
      start: this.inputStart.nativeElement.value,
      end: this.inputEnd.nativeElement.value,
      color: this.selectStatus.nativeElement.value,
      percent: this.inputPercent.nativeElement.value,
    };
    return modelSave;
  }

  // ---- utils

  calcDurationForm(): void {
    this.inputDuration.nativeElement.value = this.calcDuration(
      this.inputStart.nativeElement.value,
      this.inputEnd.nativeElement.value
    );
  }

  recalcPercent(group?: any) {
    setTimeout(() => {
      this.resetPercentGroups(group);
      this.calcPercentGroups(group);
    }, 500);
  }

  private resetPercentGroups(group?: any): void {
    if (this.diagram) {
      this.diagram.model.commit((m) => {
        const nodeModel = m.findNodeDataForKey(group);
        if (nodeModel) m.setDataProperty(nodeModel, 'percent', 0);
      });
      /*
      const groups: any[] = [];
      this.diagram.nodes.each((n) => {
        const el: KanbanModel = n.data;
        if (el.isGroup && !groups.includes(el.key)) {
          groups.push(el.key);
          el.percent = 0;
        }
      });
      */
    }
  }

  private calcPercentGroups(group?: any): void {
    if (this.diagram) {
      const groups: any[] = [];
      const groupsObj: Map<any, { total?: number; count?: number }> = new Map<
        any,
        { total?: number; count?: number }
      >();
      this.diagram.nodes.each((n) => {
        const el: KanbanModel = n.data;
        if (el.isGroup && !groups.includes(el.key)) {
          groups.push(el.key);
          groupsObj.set(el.key, { total: 0, count: 0 });
        } else if (!el.isGroup && !groups.includes(el.group)) {
          groups.push(el.group);
          groupsObj.set(el.group, { total: el.percent, count: 1 });
        } else if (!el.isGroup && groups.includes(el.group)) {
          const obj = groupsObj.get(el.group);
          const total: number =
            (obj?.total ? obj?.total : 0) + (el.percent ? el.percent : 0);
          const count: number = (obj?.count ? obj?.count : 0) + 1;
          (groupsObj.get(el.group) as any).total = +total;
          (groupsObj.get(el.group) as any).count = +count;
        }
      });

      this.diagram.model.commit((m) => {
        const objG = groupsObj.get(group);
        const nodeModel = m.findNodeDataForKey(group);
        if (nodeModel)
          m.setDataProperty(
            nodeModel,
            'percent',
            objG?.total && objG?.count
              ? +(objG?.total / objG?.count).toFixed(2)
              : 0
          );
      });

      /*
      let objG;
      groups.forEach((groupKey) => {
        objG = groupsObj.get(groupKey);

        const modelSave: KanbanModel = this.diagram.findNodeForKey(groupKey)
          ?.data as KanbanModel | any;
        modelSave.percent =
          objG?.total && objG?.count
            ? +(objG?.total / objG?.count).toFixed(2)
            : 0;
        this.updateModelCommit(modelSave);
      });
      */
    }
  }

  private calcDuration(value1?: string, value2?: string): number {
    let diff = 0;
    if (value1 && value2) {
      const data1 = new Date(value1);
      const data2 = new Date(value2);
      diff = (data2.getTime() - data1.getTime()) / (1000 * 3600 * 24);
    }
    return diff;
  }

  private formatDate(date: string): string {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
