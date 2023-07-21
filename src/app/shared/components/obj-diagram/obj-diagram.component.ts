import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
  Input,
} from '@angular/core';

import * as go from 'gojs';
import {
  DataSyncService,
  DiagramComponent,
  PaletteComponent,
} from 'gojs-angular';
import produce from 'immer';
import { DiagramBuilder } from '../../builder/diagram.builder';

@Component({
  selector: 'app-obj-diagram',
  templateUrl: './obj-diagram.component.html',
  styleUrls: ['./obj-diagram.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ObjDiagramComponent {
  @Input() state: any;
  @Input() title: string | undefined = '';
  @Input() flgInspector: boolean | undefined = false;
  @Input() flgPalette: boolean | undefined = false;
  @Input() flgOverview: boolean | undefined = false;
  @Input() flgInfo: boolean | undefined = false;
  @Input() nodeOrientation: 'Auto' | 'Vertical' | 'Horizontal' | undefined;

  @ViewChild('myDiagram', { static: true })
  public myDiagramComponent: DiagramComponent | undefined;
  @ViewChild('myPalette', { static: true })
  public myPaletteComponent: PaletteComponent | any;

  // Big object that holds app-level state data
  // As of gojs-angular 2.0, immutability is expected and required of state for ease of change detection.
  // Whenever updating state, immutability must be preserved. It is recommended to use immer for this, a small package that makes working with immutable data easy.

  public diagramDivClassName: string = 'myDiagramDiv';
  public paletteDivClassName = 'myPaletteDiv';
  public diagramWidth: string = '50%';
  public diagramHeight: string = '70vh';

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

  // initialize diagram / templates
  public initializeDiagram() {
    const diagram = DiagramBuilder.makeDiagram();

    const node = DiagramBuilder.makeNode(this.nodeOrientation);
    node.add(DiagramBuilder.makeShape());
    node.add(DiagramBuilder.makeText());
    diagram.nodeTemplate = node;

    const link = DiagramBuilder.makeLink();
    diagram.linkTemplate = link;

    const model = DiagramBuilder.makeModel();
    diagram.model = model;

    return diagram;
  }

  // When the diagram model changes, update app data to reflect those changes. Be sure to use immer's "produce" function to preserve immutability
  public diagramModelChange = (
    changes: go.IncrementalData,
    appComp: ObjDiagramComponent
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

  public initPalette(): go.Palette {
    const $ = go.GraphObject.make;
    const palette = $(go.Palette);

    // define the Node template
    palette.nodeTemplate = $(
      go.Node,
      'Auto',
      $(
        go.Shape,
        'RoundedRectangle',
        {
          stroke: null,
        },
        new go.Binding('fill', 'color')
      ),
      $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
    );

    palette.model = $(go.GraphLinksModel);
    return palette;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  // Overview Component testing
  public oDivClassName = 'myOverviewDiv';
  public initOverview(): go.Overview {
    const $ = go.GraphObject.make;
    const overview = $(go.Overview);
    return overview;
  }
  public observedDiagram: any | null = null;

  // currently selected node; for inspector
  public selectedNodeData: go.ObjectData | null = null;

  public ngAfterViewInit() {
    setTimeout(() => {
      this.afterChildFn();
    }, 200);
  } // end ngAfterViewInit

  afterChildFn() {
    if (this.observedDiagram) return;
    this.observedDiagram = this.myDiagramComponent?.diagram;
    this.cdr.detectChanges(); // IMPORTANT: without this, Angular will throw ExpressionChangedAfterItHasBeenCheckedError (dev mode only)

    const appComp: ObjDiagramComponent = this;
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

  // --------------------- EXAMPLES

  public initDiagramExample(): go.Diagram {
    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true,
      'clickCreatingTool.archetypeNodeData': {
        text: 'new node',
        color: 'lightblue',
      },
      model: $(go.GraphLinksModel, {
        nodeKeyProperty: 'id',
        linkToPortIdProperty: 'toPort',
        linkFromPortIdProperty: 'fromPort',
        linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      }),
    });

    dia.commandHandler.archetypeGroupData = { key: 'Group', isGroup: true };

    const makePort = function (id: string, spot: go.Spot) {
      return $(go.Shape, 'Circle', {
        opacity: 0.5,
        fill: 'gray',
        strokeWidth: 0,
        desiredSize: new go.Size(8, 8),
        portId: id,
        alignment: spot,
        fromLinkable: true,
        toLinkable: true,
      });
    };

    // define the Node template
    dia.nodeTemplate = $(
      go.Node,
      'Spot',
      {
        contextMenu: $(
          'ContextMenu',
          $(
            'ContextMenuButton',
            $(go.TextBlock, 'Group'),
            {
              click: function (e, obj) {
                e.diagram.commandHandler.groupSelection();
              },
            },
            new go.Binding('visible', '', function (o) {
              return o.diagram.selection.count > 1;
            }).ofObject()
          )
        ),
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Panel,
        'Auto',
        $(
          go.Shape,
          'RoundedRectangle',
          { stroke: null },
          new go.Binding('fill', 'color', (c, panel) => {
            return c;
          })
        ),
        $(
          go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding('text').makeTwoWay()
        )
      ),
      // Ports
      makePort('t', go.Spot.TopCenter),
      makePort('l', go.Spot.Left),
      makePort('r', go.Spot.Right),
      makePort('b', go.Spot.BottomCenter)
    );

    return dia;
  }
}
