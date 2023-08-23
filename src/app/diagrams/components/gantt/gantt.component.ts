import * as go from 'gojs';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { GanttTemplate } from '../../builder/gantt/gantt.template';
import { GanttUtility } from '../../builder/gantt/utility/gantt.utility';
import { GanttModel } from '../../model/gantt.model';
import { ObjStateModel } from '../../../shared/model/obj-state.model';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttComponent extends DiagramBaseComponent<GanttModel> {
  @Input() preferredColors: string[];
  enableSelectColors: boolean;
  template: any;
  dataInizio: Date;
  divTaskId = 'myTaskDiv';
  divGanttId = 'myGanttDiv';

  // form insert
  @ViewChild('inputName') inputName: ElementRef<any>;
  @ViewChild('inputStart') inputStart: ElementRef<any>;
  @ViewChild('inputDuration') inputDuration: ElementRef<any>;
  @ViewChild('inputColor') inputColor: ElementRef<any>;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    if (this.preferredColors && this.preferredColors.length) {
      this.enableSelectColors = true;
    }
  }

  override ngAfterViewInit(): void {
    setTimeout(() => {
      const myModel = this.getModel();
      this.template = GanttTemplate.make(
        this.divTaskId,
        this.divGanttId,
        this.diagramProperties
      );
      this.template.task.model = myModel;
      this.template.gantt.model = myModel;
      this.dataInizio = GanttUtility.StartDate;
      this.diagram = this.template.task;
    }, 1000);
  }

  override afterModel(state: ObjStateModel): void {}

  override getModel(): go.GraphLinksModel {
    return this.defaultModel();
  }

  override keepDataDetailFromEvent(data: GanttModel) {
    if (data && data.color && this.inputColor) {
      this.inputColor.nativeElement.value = data.color;
    }
    if (this.inputStart) {
      this.inputStart.nativeElement.value = this.formatDate(this.dataInizio);
    }
    if (this.inputDuration) {
      this.inputDuration.nativeElement.value = '7';
    }
  }
  override keepDataUpdateFromEvent(data: GanttModel) {
    if (this.inputName) {
      this.inputName.nativeElement.value = data.text;
    }

    if (this.inputStart) {
      const dateIn = new Date(this.dataInizio);
      dateIn.setDate(dateIn.getDate() + (data && data.start ? data.start : 0));
      this.inputStart.nativeElement.value = [
        dateIn.getFullYear(),
        dateIn.getMonth() + 1,
        dateIn.getDate(),
      ].join('-');
    }
    if (data && data.duration && this.inputDuration) {
      this.inputDuration.nativeElement.value = data.duration;
    }

    if (data && data.color && this.inputColor) {
      this.inputColor.nativeElement.value = data.color;
    }
  }

  override keepDataSaveFromEvent(data: GanttModel): void {}

  override saveModel() {
    // console.log(this.modalShared.getData());
    const dataSelected: GanttModel = this.modalShared.getDataDetail();
    let modelSave: GanttModel;
    if (dataSelected) {
      modelSave = this.getModelByForm();

      this.template.task.model.commit((m: any) => {
        m.addNodeData(modelSave);
        m.addLinkData({ from: dataSelected.key, to: modelSave.key });
        this.template.task.select(
          this.template.task.findNodeForData(modelSave)
        );
      });
    }
  }

  override updateModel() {
    const modelSave = this.getModelByForm();
    modelSave.key = (this.dataUpdateFromEvent as GanttModel).key;

    this.template.task.model.commit((m: any) => {
      const nodeModel = m.findNodeDataForKey(
        (this.dataUpdateFromEvent as GanttModel).key
      );
      m.assignAllDataProperties(nodeModel, modelSave);
      this.template.task.select(this.template.task.findNodeForData(modelSave));
    });
  }

  override getModelByForm(): GanttModel {
    const modelSave: GanttModel = {
      key: undefined,
      text: this.inputName.nativeElement.value,
      color: this.inputColor.nativeElement.value,
    };
    const dataScelta = new Date(this.inputStart.nativeElement.value);
    if (
      dataScelta.getFullYear() === this.dataInizio.getFullYear() &&
      dataScelta.getMonth() === this.dataInizio.getMonth() &&
      dataScelta.getDate() === this.dataInizio.getDate()
    ) {
      modelSave.start = 0;
    } else {
      const data1 = new Date(
        [
          dataScelta.getFullYear(),
          dataScelta.getMonth(),
          dataScelta.getDate(),
        ].join('-')
      );
      const data2 = new Date(
        [
          this.dataInizio.getFullYear(),
          this.dataInizio.getMonth(),
          this.dataInizio.getDate(),
        ].join('-')
      );
      const diff = (data1.getTime() - data2.getTime()) / (1000 * 3600 * 24);
      modelSave.start = diff;
    }
    modelSave.duration = GanttUtility.convertDaysToUnits(
      +this.inputDuration.nativeElement.value
    );

    return modelSave;
  }

  // ------ overrides
  override download(filename?: string | undefined): void {
    if (this.diagramModel && this.diagramModel.filenames) {
      var blob1 = this.template.task.makeImageData({
        background: 'white',
        returnType: 'blob',
        callback: (val: any) =>
          this.makeBlobCallback(val, (this.diagramModel as any).filenames[0]),
      });

      var blob2 = this.template.gantt.makeImageData({
        background: 'white',
        returnType: 'blob',
        callback: (val: any) =>
          this.makeBlobCallback(val, (this.diagramModel as any).filenames[1]),
      });
    }
  }

  // ---- utils
  private formatDate(date: Date): string {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  saveNodeExample() {
    this.template.task.model.commit((m: any) => {
      const newdata = {
        key: undefined,
        text: 'New Task',
        color: 'red',
        duration: GanttUtility.convertDaysToUnits(5),
      };
      m.addNodeData(newdata);
      m.addLinkData({ from: 'n0', to: newdata.key });
      this.template.task.select(this.template.task.findNodeForData(newdata));
    });
  }
}
