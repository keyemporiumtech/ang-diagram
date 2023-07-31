import * as go from 'gojs';
import { ObjStateModel } from '../../../shared/model/obj-state.model';
import { EnumKanbanStatus, KanbanModel } from '../../model/kanban.model';
import { EnumFigureType } from '../../../shared/enum/figure-type.enum';
import { ShapeModel } from '../../model/shape.model';

export class KanbanBoardTemplate {
  static noteColors: string[] = ['lightgray', '#CC293D', '#FFD700', '#009CCC'];
  static shapeGroup: ShapeModel = {
    type: EnumFigureType.RETTANGOLO,
    background: '#009CCC',
    borderColor: '#009CCC',
    borderSize: 1,
  };
  static shapeNode: ShapeModel = {
    type: EnumFigureType.RETTANGOLO,
    background: 'white',
    borderColor: '#CCCCCC',
  };
  static textStatusSTOP: { color: string; text: string } = {
    color: '#CC293D',
    text: 'Stopped',
  };
  static textStatusPROGRESS: { color: string; text: string } = {
    color: '#FFD700',
    text: 'In Progress',
  };
  static textStatusCOMPLETE: { color: string; text: string } = {
    color: '#009CCC',
    text: 'Completed',
  };

  static makeTemplate(properties?: KanbanBoardProperties) {
    KanbanBoardMaker.putValues(properties);

    // define a custom grid layout that makes sure the length of each lane is the same
    // and that each lane is broad enough to hold its subgraph
    class PoolLayout extends go.GridLayout {
      MINLENGTH = 200; // this controls the minimum length of any swimlane
      MINBREADTH = 100; // this controls the minimum breadth of any non-collapsed swimlane
      constructor() {
        super();
        this.MINLENGTH = 200; // this controls the minimum length of any swimlane
        this.MINBREADTH = 100; // this controls the minimum breadth of any non-collapsed swimlane
        this.cellSize = new go.Size(1, 1);
        this.wrappingColumn = Infinity;
        this.wrappingWidth = Infinity;
        this.spacing = new go.Size(0, 0);
        this.alignment = go.GridLayout.Position;
      }

      override doLayout(coll: any) {
        const diagram = this.diagram;
        if (diagram === null) return;
        diagram.startTransaction('PoolLayout');
        // make sure all of the Group Shapes are big enough
        const minlen = this.computeMinPoolLength();
        diagram.findTopLevelGroups().each((lane) => {
          if (!(lane instanceof go.Group)) return;
          const shape = lane.selectionObject;
          if (shape !== null) {
            // change the desiredSize to be big enough in both directions
            const sz = this.computeLaneSize(lane);
            shape.width = !isNaN(shape.width)
              ? Math.max(shape.width, sz.width)
              : sz.width;
            // if you want the height of all of the lanes to shrink as the maximum needed height decreases:
            shape.height = minlen;
            // if you want the height of all of the lanes to remain at the maximum height ever needed:
            //shape.height = (isNaN(shape.height) ? minlen : Math.max(shape.height, minlen));
            const cell = lane.resizeCellSize;
            if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0)
              shape.width = Math.ceil(shape.width / cell.width) * cell.width;
            if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0)
              shape.height =
                Math.ceil(shape.height / cell.height) * cell.height;
          }
        });
        // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
        super.doLayout(coll);
        diagram.commitTransaction('PoolLayout');
      }

      // compute the minimum length of the whole diagram needed to hold all of the Lane Groups
      computeMinPoolLength() {
        let len = this.MINLENGTH;
        myDiagram.findTopLevelGroups().each((lane) => {
          const holder = lane.placeholder;
          if (holder !== null) {
            const sz = holder.actualBounds;
            len = Math.max(len, sz.height);
          }
        });
        return len;
      }

      // compute the minimum size for a particular Lane Group
      computeLaneSize(lane: any) {
        // assert(lane instanceof go.Group);
        const sz = new go.Size(
          lane.isSubGraphExpanded ? this.MINBREADTH : 1,
          this.MINLENGTH
        );
        if (lane.isSubGraphExpanded) {
          const holder = lane.placeholder;
          if (holder !== null) {
            const hsz = holder.actualBounds;
            sz.width = Math.max(sz.width, hsz.width);
          }
        }
        // minimum breadth needs to be big enough to hold the header
        const hdr = lane.findObject('HEADER');
        if (hdr !== null) sz.width = Math.max(sz.width, hdr.actualBounds.width);
        return sz;
      }
    }
    // end PoolLayout class

    // -------------- DIAGRAM

    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, {
      // make sure the top-left corner of the viewport is occupied
      contentAlignment: go.Spot.TopCenter,
      // use a simple layout to stack the top-level Groups next to each other
      layout: $(PoolLayout),
      // disallow nodes to be dragged to the diagram's background
      mouseDrop: (e: any) => {
        e.diagram.currentTool.doCancel();
      },
      // a clipboard copied node is pasted into the original node's group (i.e. lane).
      'commandHandler.copiesGroupKey': true,
      // automatically re-layout the swim lanes after dragging the selection
      SelectionMoved: relayoutDiagram, // this DiagramEvent listener is
      SelectionCopied: relayoutDiagram, // defined above
      'undoManager.isEnabled': true,
      // allow TextEditingTool to start without selecting first
      'textEditingTool.starting': go.TextEditingTool.SingleClick,
    });

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

    // this is called after nodes have been moved
    function relayoutDiagram() {
      myDiagram.selection.each((n) => n.invalidateLayout());
      myDiagram.layoutDiagram();
    }

    myDiagram.nodeTemplate = $(
      go.Node,
      'Horizontal',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape,
        (this.shapeGroup as any).type,
        {
          fill: (this.shapeGroup as any).background,
          strokeWidth: (this.shapeGroup as any).borderSize,
          stroke: (this.shapeGroup as any).borderColor,
          width: 6,
          stretch: go.GraphObject.Vertical,
          alignment: go.Spot.Left,
          // if a user clicks the colored portion of a node, cycle through colors
          click: (e: any, obj: any) => {
            myDiagram.startTransaction('Update node color');
            let newColor = parseInt(obj.part.data.color) + 1;
            if (newColor > KanbanBoardTemplate.noteColors.length - 1)
              newColor = 0;
            myDiagram.model.setDataProperty(obj.part.data, 'color', newColor);
            myDiagram.commitTransaction('Update node color');
          },
        },
        new go.Binding('fill', 'color', this.getNoteColor),
        new go.Binding('stroke', 'color', this.getNoteColor)
      ),
      $(
        go.Panel,
        'Auto',
        $(go.Shape, (this.shapeNode as any).type, {
          fill: (this.shapeNode as any).background,
          stroke: (this.shapeNode as any).borderColor,
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
              font: '11px Lato, sans-serif',
              editable: true,
              stroke: '#000',
              maxSize: new go.Size(130, NaN),
              alignment: go.Spot.TopLeft,
            },
            new go.Binding('text', 'text').makeTwoWay()
          )
        )
      )
    );

    // While dragging, highlight the dragged-over group
    function highlightGroup(grp: any, show: any) {
      if (show) {
        const part: any = myDiagram.toolManager.draggingTool.currentPart;
        if (part.containingGroup !== grp) {
          grp.isHighlighted = true;
          return;
        }
      }
      grp.isHighlighted = false;
    }

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
        mouseDragEnter: (e, grp, prev) => highlightGroup(grp, true),
        mouseDragLeave: (e, grp, next) => highlightGroup(grp, false),
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
          new go.Binding('text').makeTwoWay()
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
            fill: this.textStatusSTOP.color,
            margin: 5,
          }),
          $(go.TextBlock, this.textStatusSTOP.text, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ), // end row 1
        $(
          go.Panel,
          'Horizontal',
          { row: 2, alignment: go.Spot.Left },
          $(go.Shape, 'Rectangle', {
            desiredSize: new go.Size(10, 10),
            fill: this.textStatusPROGRESS.color,
            margin: 5,
          }),
          $(go.TextBlock, this.textStatusPROGRESS.text, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ), // end row 2
        $(
          go.Panel,
          'Horizontal',
          { row: 3, alignment: go.Spot.Left },
          $(go.Shape, 'Rectangle', {
            desiredSize: new go.Size(10, 10),
            fill: this.textStatusCOMPLETE.color,
            margin: 5,
          }),
          $(go.TextBlock, this.textStatusCOMPLETE.text, {
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
              let sel: any = e.diagram.selection.first();
              if (!sel) sel = e.diagram.findTopLevelGroups().first();
              if (!(sel instanceof go.Group)) sel = sel.containingGroup;
              if (!sel) return;
              const newdata = {
                group: sel.key,
                loc: '0 9999',
                text: 'New item ' + sel.memberParts.count,
                color: 0,
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
          $(go.TextBlock, 'New item', {
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

  static reloadTemplate(data: ObjStateModel, diagram: go.Diagram) {}

  static sampleOrgModel(key: string | number, title?: string): KanbanModel {
    const obj: KanbanModel = {
      key: key,
      text: title ? title : 'EmptyName',
      isGroup: true,
      color: EnumKanbanStatus.NONE,
    };
    return obj;
  }

  // ------------- UTILS ------------------

  // There are only three note colors by default, blue, red, and yellow but you could add more here:

  static getNoteColor(num: any) {
    return KanbanBoardTemplate.noteColors[
      Math.min(num, KanbanBoardTemplate.noteColors.length - 1)
    ];
  }
}

// ------------------ PROPERTIES
export interface KanbanBoardProperties {
  noteColors?: string[];
  shapeGroup?: ShapeModel;
  shapeNode?: ShapeModel;
  textStatusSTOP?: { color?: string; text?: string };
  textStatusPROGRESS?: { color?: string; text?: string };
  textStatusCOMPLETE?: { color?: string; text?: string };
}

// ------------------ MAKER
export class KanbanBoardMaker {
  static putValues(properties?: KanbanBoardProperties) {
    if (properties) {
      if (properties.noteColors) {
        KanbanBoardTemplate.noteColors = properties.noteColors;
      }
      if (properties.shapeGroup) {
        this.putShapeGroup(properties.shapeGroup);
      }
      if (properties.shapeNode) {
        this.putShapeNode(properties.shapeNode);
      }
      if (properties.textStatusSTOP) {
        this.putTextSTOP(properties.textStatusSTOP);
      }
      if (properties.textStatusPROGRESS) {
        this.putTextPROGRESS(properties.textStatusPROGRESS);
      }
      if (properties.textStatusCOMPLETE) {
        this.putTextCOMPLETE(properties.textStatusCOMPLETE);
      }
    }
  }

  static putShapeGroup(shape?: ShapeModel) {
    if (shape) {
      if (shape.type) {
        KanbanBoardTemplate.shapeGroup.type = shape.type;
      }
      if (shape.background) {
        KanbanBoardTemplate.shapeGroup.background = shape.background;
      }
      if (shape.borderColor) {
        KanbanBoardTemplate.shapeGroup.borderColor = shape.borderColor;
      }
      if (shape.borderSize) {
        KanbanBoardTemplate.shapeGroup.borderSize = shape.borderSize;
      }
    }
  }

  static putShapeNode(shape?: ShapeModel) {
    if (shape) {
      if (shape.type) {
        KanbanBoardTemplate.shapeNode.type = shape.type;
      }
      if (shape.background) {
        KanbanBoardTemplate.shapeNode.background = shape.background;
      }
      if (shape.borderColor) {
        KanbanBoardTemplate.shapeNode.borderColor = shape.borderColor;
      }
      if (shape.borderSize) {
        KanbanBoardTemplate.shapeNode.borderSize = shape.borderSize;
      }
    }
  }

  static putTextSTOP(text?: { color?: string; text?: string }) {
    if (text) {
      if (text.color) {
        KanbanBoardTemplate.textStatusSTOP.color = text.color;
        KanbanBoardTemplate.noteColors[1] = text.color;
      }
      if (text.text) {
        KanbanBoardTemplate.textStatusSTOP.text = text.text;
      }
    }
  }

  static putTextPROGRESS(text?: { color?: string; text?: string }) {
    if (text) {
      if (text.color) {
        KanbanBoardTemplate.textStatusPROGRESS.color = text.color;
        KanbanBoardTemplate.noteColors[2] = text.color;
      }
      if (text.text) {
        KanbanBoardTemplate.textStatusPROGRESS.text = text.text;
      }
    }
  }

  static putTextCOMPLETE(text?: { color?: string; text?: string }) {
    if (text) {
      if (text.color) {
        KanbanBoardTemplate.textStatusCOMPLETE.color = text.color;
        KanbanBoardTemplate.noteColors[3] = text.color;
      }
      if (text.text) {
        KanbanBoardTemplate.textStatusCOMPLETE.text = text.text;
      }
    }
  }
}
