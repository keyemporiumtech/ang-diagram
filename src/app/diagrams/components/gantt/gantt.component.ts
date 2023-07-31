import * as go from 'gojs';
import produce from 'immer';
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { GanttTemplate } from '../../builder/gantt/gantt.template';
import { DataSyncService, DiagramComponent } from 'gojs-angular';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttComponent extends DiagramBaseComponent {
  template: any;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
  public observedDiagramTask: any | null = null;
  public observedDiagramGantt: any | null = null;

  @ViewChild('myTask', { static: true })
  public myTaskComponent: DiagramComponent | undefined;
  @ViewChild('myGantt', { static: true })
  public myGanttComponent: DiagramComponent | undefined;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngAfterViewInit(): void {
    this.afterChildTaskFn();
    this.afterChildGanttFn();
  }

  override initializeDiagram() {
    return undefined;
  }

  initTask() {
    return GanttTemplate.makeTemplate().task;
  }
  initGantt() {
    return GanttTemplate.makeTemplate().gantt;
  }

  /* ------------- FUNCTIONS ----------------- */
  public diagramTaskModelChange = (
    changes: go.IncrementalData,
    appComp: GanttComponent
  ) => {
    if (!changes) return;
    // const appComp = this;
    this.state = produce(appComp.state, (draft: any) => {
      // set skipsDiagramUpdate: true since GoJS already has this update
      // this way, we don't log an unneeded transaction in the Diagram's undoManager history
      draft.skipsDiagramUpdate = true;
      draft.diagramNodeData = DataSyncService.syncNodeData(
        changes,
        draft.diagramNodeData,
        appComp.observedDiagramTask.model
      );
      draft.diagramLinkData = DataSyncService.syncLinkData(
        changes,
        draft.diagramLinkData,
        appComp.observedDiagramTask.model
      );
      draft.diagramModelData = DataSyncService.syncModelData(
        changes,
        draft.diagramModelData
      );
      // If one of the modified nodes was the selected node used by the inspector, update the inspector selectedNodeData object
      const modifiedNodeDatas = changes.modifiedNodeData;
      if (modifiedNodeDatas && draft.selectedNodeData) {
        for (let i = 0; i < modifiedNodeDatas.length; i++) {
          const mn = modifiedNodeDatas[i];
          const nodeKeyProperty = appComp.myTaskComponent?.diagram.model
            .nodeKeyProperty as string;
          if (mn[nodeKeyProperty] === draft.selectedNodeData[nodeKeyProperty]) {
            draft.selectedNodeData = mn;
          }
        }
      }
    });
  };

  public diagramGanttModelChange = (
    changes: go.IncrementalData,
    appComp: GanttComponent
  ) => {
    if (!changes) return;
    // const appComp = this;
    this.state = produce(appComp.state, (draft: any) => {
      // set skipsDiagramUpdate: true since GoJS already has this update
      // this way, we don't log an unneeded transaction in the Diagram's undoManager history
      draft.skipsDiagramUpdate = true;
      draft.diagramNodeData = DataSyncService.syncNodeData(
        changes,
        draft.diagramNodeData,
        appComp.observedDiagramGantt.model
      );
      draft.diagramLinkData = DataSyncService.syncLinkData(
        changes,
        draft.diagramLinkData,
        appComp.observedDiagramGantt.model
      );
      draft.diagramModelData = DataSyncService.syncModelData(
        changes,
        draft.diagramModelData
      );
      // If one of the modified nodes was the selected node used by the inspector, update the inspector selectedNodeData object
      const modifiedNodeDatas = changes.modifiedNodeData;
      if (modifiedNodeDatas && draft.selectedNodeData) {
        for (let i = 0; i < modifiedNodeDatas.length; i++) {
          const mn = modifiedNodeDatas[i];
          const nodeKeyProperty = appComp.myGanttComponent?.diagram.model
            .nodeKeyProperty as string;
          if (mn[nodeKeyProperty] === draft.selectedNodeData[nodeKeyProperty]) {
            draft.selectedNodeData = mn;
          }
        }
      }
    });
  };

  afterChildTaskFn() {
    if (this.observedDiagramTask) return;
    this.observedDiagramTask = this.myTaskComponent?.diagram;
    this.getCdr().detectChanges(); // IMPORTANT: without this, Angular will throw ExpressionChangedAfterItHasBeenCheckedError (dev mode only)

    const appComp: DiagramBaseComponent = this;
    // listener for inspector
    this.myTaskComponent?.diagram.addDiagramListener(
      'ChangedSelection',
      function (e) {
        if (e.diagram.selection.count === 0) {
          appComp.selectedNodeData = null;
        }
        const node = e.diagram.selection.first();
        appComp.state = produce(appComp.state, (draft: any) => {
          if (node instanceof go.Node) {
            var idx = draft.diagramNodeData.findIndex(
              (nd: any) => nd.id == node.data.id
            );
            var nd = draft.diagramNodeData[idx];
            draft.selectedNodeData = nd;
          } else {
            draft.selectedNodeData = null;
          }
        });
      }
    );
  }

  afterChildGanttFn() {
    if (this.observedDiagramGantt) return;
    this.observedDiagramGantt = this.myGanttComponent?.diagram;
    this.getCdr().detectChanges(); // IMPORTANT: without this, Angular will throw ExpressionChangedAfterItHasBeenCheckedError (dev mode only)

    const appComp: DiagramBaseComponent = this;
    // listener for inspector
    this.myGanttComponent?.diagram.addDiagramListener(
      'ChangedSelection',
      function (e) {
        if (e.diagram.selection.count === 0) {
          appComp.selectedNodeData = null;
        }
        const node = e.diagram.selection.first();
        appComp.state = produce(appComp.state, (draft: any) => {
          if (node instanceof go.Node) {
            var idx = draft.diagramNodeData.findIndex(
              (nd: any) => nd.id == node.data.id
            );
            var nd = draft.diagramNodeData[idx];
            draft.selectedNodeData = nd;
          } else {
            draft.selectedNodeData = null;
          }
        });
      }
    );
  }
}
