import * as go from 'gojs';
import produce from 'immer';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DataSyncService,
  DiagramComponent,
  PaletteComponent,
} from 'gojs-angular';
import { ObjStateModel } from '../../shared/model/obj-state.model';

@Directive()
export abstract class DiagramAngBaseComponent implements OnInit, AfterViewInit {
  private _state: ObjStateModel | any;
  @Input() set state(val: ObjStateModel | any) {
    this._state = val;
    this.cdr.markForCheck();
  }
  get state(): ObjStateModel | any {
    return this._state;
  }
  @Input() title: string | undefined = '';
  @Input() flgInspector: boolean | undefined = false;
  @Input() flgPalette: boolean | undefined = false;
  @Input() flgOverview: boolean | undefined = false;
  @Input() flgInfo: boolean | undefined = false;
  @Input() nodeOrientation: 'Auto' | 'Vertical' | 'Horizontal' | undefined =
    'Horizontal';

  @ViewChild('myDiagram', { static: true })
  public myDiagramComponent: DiagramComponent | undefined;
  @ViewChild('myPalette', { static: true })
  public myPaletteComponent: PaletteComponent | any;

  // Big object that holds app-level state data
  // As of gojs-angular 2.0, immutability is expected and required of state for ease of change detection.
  // Whenever updating state, immutability must be preserved. It is recommended to use immer for this, a small package that makes working with immutable data easy.

  public diagramDivClassName: string = 'myDiagramDiv';
  public paletteDivClassName = 'myPaletteDiv';

  // Overview Component testing
  public oDivClassName = 'myOverviewDiv';
  public diagramWidth: string = '50%';
  public diagramHeight: string = '70vh';

  public observedDiagram: any | null = null;

  // currently selected node; for inspector
  public selectedNodeData: go.ObjectData | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    let cntW = 0;
    if (this.flgPalette) {
      cntW++;
    }
    if (this.flgOverview) {
      cntW++;
    }
    if (this.flgInspector) {
      cntW++;
    }

    switch (cntW) {
      case 0:
        this.diagramWidth = '100%';
        break;
      case 1:
        this.diagramWidth = '80%';
        break;
      case 2:
        this.diagramWidth = '60%';
        break;
      case 3:
        this.diagramWidth = '50%';
        break;
    }

    this.diagramHeight = this.flgInfo ? '70vh' : '100vh';
  }

  public ngAfterViewInit() {
    this.afterChildFn();
    /*
    setTimeout(() => {
      this.afterChildFn();
    }, 1000);
    */
  } // end ngAfterViewInit

  /* ------------- IMPLEMENTATIONS ----------------- */
  abstract initializeDiagram(): go.Diagram | undefined;

  public initPalette(): go.Palette {
    const $ = go.GraphObject.make;
    const palette = $(go.Palette);

    palette.model = $(go.GraphLinksModel);
    return palette;
  }

  public initOverview(): go.Overview {
    const $ = go.GraphObject.make;
    const overview = $(go.Overview);
    return overview;
  }

  /* ------------- OPERATIONS ----------------- */

  private makeBlobCallback(blob: any, filename: string | undefined) {
    if (!filename) {
      filename = 'Graph.png';
    }
    var url = window.URL.createObjectURL(blob);

    const a: any = document.createElement('a');
    a.style = 'display: none';
    a.href = url;
    a.download = filename;

    // IE 11
    /*
    if (window.navigator['msSaveBlob'] !== undefined) {
      window.navigatormsSaveBlob(blob, filename);
      return;
    }
    */

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  download(filename?: string) {
    var blob = this.myDiagramComponent?.diagram.makeImageData({
      background: 'white',
      returnType: 'blob',
      callback: (val) => this.makeBlobCallback(val, filename),
    });
  }

  zoomFit() {
    this.myDiagramComponent?.diagram.commandHandler.zoomToFit();
  }

  center() {
    (this.myDiagramComponent as any).diagram.scale = 1;
    this.myDiagramComponent?.diagram?.scrollToRect(
      (this.myDiagramComponent as any).diagram?.findNodeForKey(0)?.actualBounds
    );
  }

  getJson(): string {
    const json = (this.myDiagramComponent as any).diagram.model.toJson();
    (this.myDiagramComponent as any).diagram.isModified = false;
    return json;
  }

  /* ------------- FUNCTIONS ----------------- */
  public diagramModelChange = (
    changes: go.IncrementalData,
    appComp: DiagramAngBaseComponent
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
        appComp.observedDiagram.model
      );
      draft.diagramLinkData = DataSyncService.syncLinkData(
        changes,
        draft.diagramLinkData,
        appComp.observedDiagram.model
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
          const nodeKeyProperty = appComp.myDiagramComponent?.diagram.model
            .nodeKeyProperty as string;
          if (mn[nodeKeyProperty] === draft.selectedNodeData[nodeKeyProperty]) {
            draft.selectedNodeData = mn;
          }
        }
      }
    });
  };

  afterChildFn() {
    if (this.observedDiagram) return;
    this.observedDiagram = this.myDiagramComponent?.diagram;
    this.cdr.detectChanges(); // IMPORTANT: without this, Angular will throw ExpressionChangedAfterItHasBeenCheckedError (dev mode only)

    const appComp: DiagramAngBaseComponent = this;
    // listener for inspector
    this.myDiagramComponent?.diagram.addDiagramListener(
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
  /**
   * Update a node's data based on some change to an inspector row's input
   * @param changedPropAndVal An object with 2 entries: "prop" (the node data prop changed), and "newVal" (the value the user entered in the inspector <input>)
   */
  public handleInspectorChange(changedPropAndVal: any) {
    const path = changedPropAndVal.prop;
    const value = changedPropAndVal.newVal;

    this.state = produce(this.state, (draft: any) => {
      var data = draft.selectedNodeData;
      data[path] = value;
      const key = data.id;
      const idx = draft.diagramNodeData.findIndex((nd: any) => nd.id == key);
      if (idx >= 0) {
        draft.diagramNodeData[idx] = data;
        draft.skipsDiagramUpdate = false; // we need to sync GoJS data with this new app state, so do not skips Diagram update
      }
    });
  }

  // utils
  getCdr() {
    return this.cdr;
  }
}
