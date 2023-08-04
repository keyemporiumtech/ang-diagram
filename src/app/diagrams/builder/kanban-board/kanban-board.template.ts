import * as go from 'gojs';
import { PoolLayout } from './classes/pool.layout';
import { KanbanUtility } from './utility/kanban.utility';
import { KanbanProperties } from './properties/kanban.properties';
import { KanbanPropertiesMaker } from './properties/kanban-properties.maker';

export class KanbanBoardTemplate {
  static make(divDiagramId: string, properties?: KanbanProperties) {
    KanbanPropertiesMaker.setValues(properties);

    const myDiagram = this.makeDiagram(divDiagramId);

    myDiagram.layout = new PoolLayout(myDiagram);

    myDiagram.nodeTemplate.contextMenu = KanbanUtility.standardContextMenus();
    myDiagram.nodeTemplate.toolTip = KanbanUtility.makeTooltip();

    // Customize the dragging tool:
    // When dragging a node set its opacity to 0.6 and move it to be in front of other nodes
    myDiagram.toolManager.draggingTool.doActivate = function () {
      // method override must be function, not =>
      go.DraggingTool.prototype.doActivate.call(this);
      (this.currentPart as any).opacity = 0.6;
      (this.currentPart as any).layerName = 'Foreground';
    };
    myDiagram.toolManager.draggingTool.doDeactivate = function () {
      // method override must be function, not =>
      (this.currentPart as any).opacity = 1;
      (this.currentPart as any).layerName = '';
      go.DraggingTool.prototype.doDeactivate.call(this);
    };

    // automatically re-layout the swim lanes after dragging the selection
    myDiagram.addDiagramListener('SelectionMoved', (e: any) =>
      KanbanUtility.relayoutDiagram(myDiagram)
    );
    myDiagram.addDiagramListener('SelectionCopied', (e: any) =>
      KanbanUtility.relayoutDiagram(myDiagram)
    );

    return myDiagram;
  }

  static makeDiagram(divId: string) {
    const $ = go.GraphObject.make;

    const myDiagram = new go.Diagram(divId, {
      // make sure the top-left corner of the viewport is occupied
      contentAlignment: go.Spot.TopLeft,
      // disallow nodes to be dragged to the diagram's background
      mouseDrop: (e) => {
        e.diagram.currentTool.doCancel();
      },
      // a clipboard copied node is pasted into the original node's group (i.e. lane).
      'commandHandler.copiesGroupKey': true,
      'undoManager.isEnabled': true,
      // allow TextEditingTool to start without selecting first
      'textEditingTool.starting': go.TextEditingTool.SingleClick,
    });

    myDiagram.nodeTemplate = $(
      go.Node,
      'Horizontal',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      // KanbanUtility.standardContextMenus(),
      $(
        go.Shape,
        (KanbanUtility.shapeGroup as any).type,
        {
          fill: (KanbanUtility.shapeGroup as any).background,
          strokeWidth: (KanbanUtility.shapeGroup as any).borderSize,
          stroke: (KanbanUtility.shapeGroup as any).borderColor,
          width: 6,
          stretch: go.GraphObject.Vertical,
          alignment: go.Spot.Left,
          // if a user clicks the colored portion of a node, cycle through colors
          click: (e: any, obj: any) => {
            myDiagram.startTransaction('Update node color');
            let newColor = parseInt(obj.part.data.color) + 1;
            if (newColor > KanbanUtility.noteColors.length - 1) newColor = 0;
            myDiagram.model.setDataProperty(obj.part.data, 'color', newColor);
            myDiagram.commitTransaction('Update node color');
          },
        },
        new go.Binding('fill', 'color', KanbanUtility.getNoteColor),
        new go.Binding('stroke', 'color', KanbanUtility.getNoteColor)
      ),
      $(
        go.Panel,
        'Auto',
        $(go.Shape, (KanbanUtility.shapeNode as any).type, {
          fill: (KanbanUtility.shapeNode as any).background,
          stroke: (KanbanUtility.shapeNode as any).borderColor,
        }),
        $(
          go.Panel,
          'Table',
          { width: 130, minSize: new go.Size(NaN, 50) },
          $(
            go.TextBlock,
            {
              name: 'TEXT',
              margin: 6,
              font: 'bold 12px Lato, bold sans-serif',
              editable: true,
              stroke: '#000',
              maxSize: new go.Size(130, NaN),
              alignment: go.Spot.TopLeft,
              row: 0,
            },
            new go.Binding('text', 'text').makeTwoWay()
          ),
          $(
            go.TextBlock,
            {
              name: 'TEXT',
              margin: 6,
              font: '11px Lato, sans-serif',
              editable: true,
              stroke: '#000',
              maxSize: new go.Size(130, NaN),
              alignment: go.Spot.TopLeft,
              row: 1,
            },
            new go.Binding('text', '', KanbanUtility.textConvert).makeTwoWay()
          )
        )
      )
    );

    myDiagram.groupTemplate = $(
      go.Group,
      'Vertical',
      {
        selectable: false,
        selectionObjectName: 'SHAPE', // even though its not selectable, this is used in the layout
        layerName: 'Background', // all lanes are always behind all nodes and links
        layout: $(
          go.GridLayout, // automatically lay out the lane's subgraph
          {
            wrappingColumn: 1,
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(5, 5),
            alignment: go.GridLayout.Position,
            comparer: (a: any, b: any) => {
              // can re-order tasks within a lane
              const ay = a.location.y;
              const by = b.location.y;
              if (isNaN(ay) || isNaN(by)) return 0;
              if (ay < by) return -1;
              if (ay > by) return 1;
              return 0;
            },
          }
        ),
        click: (e, grp) => {
          // allow simple click on group to clear selection
          if (!e.shift && !e.control && !e.meta) e.diagram.clearSelection();
        },
        computesBoundsIncludingLocation: true,
        computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
        handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
        mouseDragEnter: (e, grp, prev) =>
          KanbanUtility.highlightGroup(grp, true, myDiagram),
        mouseDragLeave: (e, grp, next) =>
          KanbanUtility.highlightGroup(grp, false, myDiagram),
        mouseDrop: (e, grp: any) => {
          // dropping a copy of some Nodes and Links onto this Group adds them to this Group
          // don't allow drag-and-dropping a mix of regular Nodes and Groups
          if (e.diagram.selection.all((n) => !(n instanceof go.Group))) {
            const ok = grp.addMembers(grp.diagram.selection, true);
            if (!ok) grp.diagram.currentTool.doCancel();
          }
        },
        subGraphExpandedChanged: (grp: any) => {
          const shp = grp.selectionObject;
          if (grp.diagram.undoManager.isUndoingRedoing) return;
          if (grp.isSubGraphExpanded) {
            shp.width = grp.data.savedBreadth;
          } else {
            // remember the original width
            if (!isNaN(shp.width))
              grp.diagram.model.set(grp.data, 'savedBreadth', shp.width);
            shp.width = NaN;
          }
        },
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      new go.Binding('isSubGraphExpanded', 'expanded').makeTwoWay(),
      // the lane header consisting of a TextBlock and an expander button
      $(
        go.Panel,
        'Horizontal',
        { name: 'HEADER', alignment: go.Spot.Left },
        $('SubGraphExpanderButton', { margin: 5 }), // this remains always visible
        $(
          go.TextBlock, // the lane label
          {
            font: '15px Lato, sans-serif',
            editable: true,
            margin: new go.Margin(2, 0, 0, 0),
          },
          // this is hidden when the swimlane is collapsed
          new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
          new go.Binding(
            'text',
            '',
            KanbanUtility.textGroupConvert
          ).makeTwoWay()
        )
      ), // end Horizontal Panel
      $(
        go.Panel,
        'Auto', // the lane consisting of a background Shape and a Placeholder representing the subgraph
        $(
          go.Shape,
          'Rectangle', // this is the resized object
          { name: 'SHAPE', fill: '#F1F1F1', stroke: null, strokeWidth: 4 }, // strokeWidth controls space between lanes
          new go.Binding('fill', 'isHighlighted', (h) =>
            h ? '#D6D6D6' : '#F1F1F1'
          ).ofObject(),
          new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
            go.Size.stringify
          )
        ),
        $(go.Placeholder, { padding: 12, alignment: go.Spot.TopLeft }),
        $(
          go.TextBlock, // this TextBlock is only seen when the swimlane is collapsed
          {
            name: 'LABEL',
            font: '15px Lato, sans-serif',
            editable: true,
            angle: 90,
            alignment: go.Spot.TopLeft,
            margin: new go.Margin(4, 0, 0, 2),
          },
          new go.Binding('visible', 'isSubGraphExpanded', (e) => !e).ofObject(),
          new go.Binding('text').makeTwoWay()
        )
      ) // end Auto Panel
    ); // end Group

    // Set up an unmodeled Part as a legend, and place it directly on the diagram.
    myDiagram.add(
      $(
        go.Part,
        'Table',
        { position: new go.Point(10, 10), selectable: false },
        $(go.TextBlock, 'Key', {
          row: 0,
          font: '700 14px Droid Serif, sans-serif',
        }), // end row 0
        $(
          go.Panel,
          'Horizontal',
          { row: 1, alignment: go.Spot.Left },
          $(go.Shape, 'Rectangle', {
            desiredSize: new go.Size(10, 10),
            fill: KanbanUtility.textStatusSTOP.color,
            margin: 5,
          }),
          $(go.TextBlock, KanbanUtility.textStatusSTOP.text, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ), // end row 1
        $(
          go.Panel,
          'Horizontal',
          { row: 2, alignment: go.Spot.Left },
          $(go.Shape, 'Rectangle', {
            desiredSize: new go.Size(10, 10),
            fill: KanbanUtility.textStatusPROGRESS.color,
            margin: 5,
          }),
          $(go.TextBlock, KanbanUtility.textStatusPROGRESS.text, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ), // end row 2
        $(
          go.Panel,
          'Horizontal',
          { row: 3, alignment: go.Spot.Left },
          $(go.Shape, 'Rectangle', {
            desiredSize: new go.Size(10, 10),
            fill: KanbanUtility.textStatusCOMPLETE.color,
            margin: 5,
          }),
          $(go.TextBlock, KanbanUtility.textStatusCOMPLETE.text, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ), // end row 3
        $(
          go.Panel,
          'Horizontal',
          {
            row: 4,
            click: (e, node) => {
              e.diagram.startTransaction('add node');
              let sel = e.diagram.selection.first();
              if (!sel) sel = e.diagram.findTopLevelGroups().first();
              if (!(sel instanceof go.Group))
                sel = (sel as any).containingGroup;
              if (!sel) return;
              const newdata = {
                group: sel.key,
                loc: '0 9999',
                text: 'New item ' + (sel as any).memberParts.count,
                color: 0,
                percent: 0,
              };
              e.diagram.model.addNodeData(newdata);
              e.diagram.commitTransaction('add node');
              const newnode: any = myDiagram.findNodeForData(newdata);
              e.diagram.select(newnode);
              e.diagram.commandHandler.editTextBlock();
              e.diagram.commandHandler.scrollToPart(newnode);
            },
            background: 'white',
            margin: new go.Margin(10, 4, 4, 4),
          },
          $(
            go.Panel,
            'Auto',
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              stroke: null,
              fill: '#6FB583',
            }),
            $(go.Shape, 'PlusLine', {
              margin: 6,
              strokeWidth: 2,
              width: 12,
              height: 12,
              stroke: 'white',
              background: '#6FB583',
            })
          ),
          $(go.TextBlock, 'New Item', {
            font: '10px Lato, sans-serif',
            margin: 6,
          })
        ), // end new item
        $(
          go.Panel,
          'Horizontal',
          {
            row: 5,
            click: (e, node) => {
              e.diagram.startTransaction('add node');
              let sel = e.diagram.selection.first();
              if (!sel) sel = e.diagram.findTopLevelGroups().first();
              if (!(sel instanceof go.Group))
                sel = (sel as any).containingGroup;
              if (!sel) return;
              const newdata = {
                isGroup: true,
                loc: '0 9999',
                text: 'New Group ',
                color: 0,
                percent: 0,
              };
              e.diagram.model.addNodeData(newdata);
              e.diagram.commitTransaction('add node');
              const newnode: any = myDiagram.findNodeForData(newdata);
              e.diagram.select(newnode);
              e.diagram.commandHandler.editTextBlock();
              e.diagram.commandHandler.scrollToPart(newnode);
            },
            background: 'white',
            margin: new go.Margin(10, 4, 4, 4),
          },
          $(
            go.Panel,
            'Auto',
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              stroke: null,
              fill: '#6FB583',
            }),
            $(go.Shape, 'PlusLine', {
              margin: 6,
              strokeWidth: 2,
              width: 12,
              height: 12,
              stroke: 'white',
              background: '#6FB583',
            })
          ),
          $(go.TextBlock, 'New Group', {
            font: '10px Lato, sans-serif',
            margin: 6,
          })
        )
      )
    );

    myDiagram.model = new go.GraphLinksModel({
      linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksMode
      // linkDataArray: linkDataArray,
    });

    return myDiagram;
  }
}
