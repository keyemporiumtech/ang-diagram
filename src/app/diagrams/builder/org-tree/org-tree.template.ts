import * as go from 'gojs';
import { OrgModel } from '../../model/org.model';
import { ObjStateModel } from '../../../shared/model/obj-state.model';
import { EnumFigureType } from '../../../shared/enum/figure-type.enum';
import { ShapeModel } from '../../model/shape.model';

export class OrgTreeTemplate {
  static levelColors: string[] = [
    '#AC193D',
    '#2672EC',
    '#8C0095',
    '#5133AB',
    '#008299',
    '#D24726',
    '#008A00',
    '#094AB2',
  ];
  static shape: ShapeModel = {
    type: EnumFigureType.RETTANGOLO,
    background: '#333333',
    borderColor: 'white',
    borderSize: 3.5,
  };
  static textAddEmploy: string = 'Add Employee';
  static textVacatePosition: string = 'Vacate Position';
  static textRemoveRole: string = 'Remove Role';
  static textRemoveDepartment: string = 'Remove Department';

  static makeTemplate(properties?: OrgTreeProperties) {
    OrgTreeMaker.putValues(properties);

    const $ = go.GraphObject.make; // for conciseness in defining templates

    const myDiagram = $(go.Diagram, {
      allowCopy: false,
      allowDelete: false,
      //initialAutoScale: go.Diagram.Uniform,
      maxSelectionCount: 1, // users can select only one part at a time
      validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
      'clickCreatingTool.archetypeNodeData': {
        // allow double-click in background to create a new node
        name: '(new person)',
        title: '',
        comments: '',
      },
      'clickCreatingTool.insertPart': function (loc: any) {
        // method override must be function, not =>
        const node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
        if (node !== null) {
          (this as any).diagram.select(node);
          (this as any).diagram.commandHandler.scrollToPart(node);
          (this as any).diagram.commandHandler.editTextBlock(
            node.findObject('NAMETB')
          );
        }
        return node;
      },
      layout: $(go.TreeLayout, {
        treeStyle: go.TreeLayout.StyleLastParents,
        arrangement: go.TreeLayout.ArrangementHorizontal,
        // properties for most of the tree:
        angle: 90,
        layerSpacing: 35,
        // properties for the "last parents":
        alternateAngle: 90,
        alternateLayerSpacing: 35,
        alternateAlignment: go.TreeLayout.AlignmentBus,
        alternateNodeSpacing: 20,
      }),
      'undoManager.isEnabled': true, // enable undo & redo
    });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener('Modified', (e) => {
      const button: any = document.getElementById('SaveButton');
      if (button) button.disabled = !myDiagram.isModified;
      const idx = document.title.indexOf('*');
      if (myDiagram.isModified) {
        if (idx < 0) document.title += '*';
      } else {
        if (idx >= 0) document.title = document.title.slice(0, idx);
      }
    });

    // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
    (myDiagram.layout as any).commitNodes = function () {
      // method override must be function, not =>
      (go.TreeLayout.prototype as any).commitNodes.call(this); // do the standard behavior
      // then go through all of the vertexes and set their corresponding node's Shape.fill
      // to a brush dependent on the TreeVertex.level value
      myDiagram.layout.network?.vertexes.each((v: any) => {
        if (v.node) {
          const level = v.level % OrgTreeTemplate.levelColors.length;
          const color = OrgTreeTemplate.levelColors[level];
          const shape = v.node.findObject('SHAPE');
          if (shape)
            shape.stroke = $(go.Brush, 'Linear', {
              0: color,
              1: go.Brush.lightenBy(color, 0.05),
              start: go.Spot.Left,
              end: go.Spot.Right,
            });
        }
      });
    };

    // define the Node template
    myDiagram.nodeTemplate = $(
      go.Node,
      'Spot',
      {
        selectionObjectName: 'BODY',
        mouseEnter: (e, node) =>
          ((node as any).findObject('BUTTON').opacity = (
            node as any
          ).findObject('BUTTONX').opacity =
            1),
        mouseLeave: (e, node) =>
          ((node as any).findObject('BUTTON').opacity = (
            node as any
          ).findObject('BUTTONX').opacity =
            0),
        // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: (e, node, prev) => {
          const diagram = node.diagram;
          const selnode = diagram?.selection.first();
          if (!this.mayWorkFor(selnode, node)) return;
          const shape = (node as any).findObject('SHAPE');
          if (shape) {
            shape._prevFill = shape.fill; // remember the original brush
            shape.fill = 'darkred';
          }
        },
        mouseDragLeave: (e, node, next) => {
          const shape = (node as any).findObject('SHAPE');
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill; // restore the original brush
          }
        },
        mouseDrop: (e, node) => {
          const diagram = node.diagram;
          const selnode = diagram?.selection.first(); // assume just one Node in selection
          if (this.mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            const link = (selnode as any).findTreeParentLink();
            if (link !== null) {
              // reconnect any existing link
              link.fromNode = node;
            } else {
              // else create a new link
              diagram?.toolManager.linkingTool.insertLink(
                node as go.Node,
                (node as go.Node).port,
                selnode as go.Node,
                (selnode as go.Node).port
              );
            }
          }
        },
      },
      // for sorting, have the Node.text be the data.name
      new go.Binding('text', 'name'),
      // bind the Part.layerName to control the Node's layer depending on whether it isSelected
      new go.Binding('layerName', 'isSelected', (sel) =>
        sel ? 'Foreground' : ''
      ).ofObject(),
      $(
        go.Panel,
        'Auto',
        { name: 'BODY' },
        // define the node's outer shape
        $(go.Shape, (this.shape as any).type, {
          name: 'SHAPE',
          fill: (this.shape as any).background,
          stroke: (this.shape as any).borderColor,
          strokeWidth: (this.shape as any).borderSize,
          portId: '',
        }),
        $(
          go.Panel,
          'Horizontal',
          $(
            go.Picture,
            {
              name: 'Picture',
              desiredSize: new go.Size(70, 70),
              margin: 1.5,
              source: 'assets/images/orgTree/user.png', // the default image
            },
            new go.Binding('source', 'pic', this.findHeadShot)
          ),
          // define the panel where the text will appear
          $(
            go.Panel,
            'Table',
            {
              minSize: new go.Size(130, NaN),
              maxSize: new go.Size(150, NaN),
              margin: new go.Margin(6, 10, 0, 6),
              defaultAlignment: go.Spot.Left,
            },
            $(go.RowColumnDefinition, { column: 2, width: 4 }),
            $(
              go.TextBlock,
              this.textStyle(), // the name
              {
                name: 'NAMETB',
                row: 0,
                column: 0,
                columnSpan: 5,
                font: '12pt Segoe UI,sans-serif',
                editable: true,
                isMultiline: false,
                minSize: new go.Size(50, 16),
              },
              new go.Binding('text', 'name').makeTwoWay()
            ),
            $(go.TextBlock, 'Title: ', this.textStyle(), { row: 1, column: 0 }),
            $(
              go.TextBlock,
              this.textStyle(),
              {
                row: 1,
                column: 1,
                columnSpan: 4,
                editable: true,
                isMultiline: false,
                minSize: new go.Size(50, 14),
                margin: new go.Margin(0, 0, 0, 3),
              },
              new go.Binding('text', 'title').makeTwoWay()
            ),
            $(
              go.TextBlock,
              this.textStyle(),
              { row: 2, column: 0 },
              new go.Binding('text', 'key', (v) => 'ID: ' + v)
            ),
            $(
              go.TextBlock,
              this.textStyle(), // the comments
              {
                row: 3,
                column: 0,
                columnSpan: 5,
                font: 'italic 9pt sans-serif',
                wrap: go.TextBlock.WrapFit,
                editable: true, // by default newlines are allowed
                minSize: new go.Size(100, 14),
              },
              new go.Binding('text', 'comments').makeTwoWay()
            )
          ) // end Table Panel
        ) // end Horizontal Panel
      ), // end Auto Panel
      $(
        'Button',
        $(go.Shape, 'PlusLine', { width: 10, height: 10 }),
        {
          name: 'BUTTON',
          alignment: go.Spot.Right,
          opacity: 0, // initially not visible
          click: (e, button) => addEmployee(button.part),
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding('opacity', 'isSelected', (s) => (s ? 1 : 0)).ofObject()
      ),
      new go.Binding('isTreeExpanded').makeTwoWay(),
      $(
        'TreeExpanderButton',
        {
          name: 'BUTTONX',
          alignment: go.Spot.Bottom,
          opacity: 0, // initially not visible
          _treeExpandedFigure: 'TriangleUp',
          _treeCollapsedFigure: 'TriangleDown',
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding('opacity', 'isSelected', (s) => (s ? 1 : 0)).ofObject()
      )
    ); // end Node, a Spot Panel

    function addEmployee(node: any) {
      if (!node) return;
      const thisemp = node.data;
      myDiagram.startTransaction('add employee');
      const newemp = {
        name: '(new person)',
        title: '(title)',
        comments: '',
        parent: thisemp.key,
      };
      myDiagram.model.addNodeData(newemp);
      const newnode: any = myDiagram.findNodeForData(newemp);
      if (newnode) newnode.location = node.location;
      myDiagram.commitTransaction('add employee');
      myDiagram.commandHandler.scrollToPart(newnode);
    }

    // the context menu allows users to make a position vacant,
    // remove a role and reassign the subtree, or remove a department
    myDiagram.nodeTemplate.contextMenu = $(
      'ContextMenu',
      $('ContextMenuButton', $(go.TextBlock, OrgTreeTemplate.textAddEmploy), {
        click: (e, button) => addEmployee((button.part as any).adornedPart),
      }),
      $(
        'ContextMenuButton',
        $(go.TextBlock, OrgTreeTemplate.textVacatePosition),
        {
          click: (e, button) => {
            const node = (button.part as any).adornedPart;
            if (node !== null) {
              const thisemp = node.data;
              myDiagram.startTransaction('vacate');
              // update the key, name, picture, and comments, but leave the title
              myDiagram.model.setDataProperty(thisemp, 'name', '(Vacant)');
              myDiagram.model.setDataProperty(thisemp, 'pic', '');
              myDiagram.model.setDataProperty(thisemp, 'comments', '');
              myDiagram.commitTransaction('vacate');
            }
          },
        }
      ),
      $('ContextMenuButton', $(go.TextBlock, OrgTreeTemplate.textRemoveRole), {
        click: (e, button) => {
          // reparent the subtree to this node's boss, then remove the node
          const node = (button.part as any).adornedPart;
          if (node !== null) {
            myDiagram.startTransaction('reparent remove');
            const chl = node.findTreeChildrenNodes();
            // iterate through the children and set their parent key to our selected node's parent key
            while (chl.next()) {
              const emp = chl.value;
              (myDiagram.model as any).setParentKeyForNodeData(
                emp.data,
                node.findTreeParentNode().data.key
              );
            }
            // and now remove the selected node itself
            myDiagram.model.removeNodeData(node.data);
            myDiagram.commitTransaction('reparent remove');
          }
        },
      }),
      $(
        'ContextMenuButton',
        $(go.TextBlock, OrgTreeTemplate.textRemoveDepartment),
        {
          click: (e, button) => {
            // remove the whole subtree, including the node itself
            const node = (button.part as any).adornedPart;
            if (node !== null) {
              myDiagram.startTransaction('remove dept');
              myDiagram.removeParts(node.findTreeParts());
              myDiagram.commitTransaction('remove dept');
            }
          },
        }
      )
    );

    // define the Link template
    myDiagram.linkTemplate = $(
      go.Link,
      go.Link.Orthogonal,
      { layerName: 'Background', corner: 5 },
      $(go.Shape, { strokeWidth: 1.5, stroke: '#424242' }).bind(
        'stroke',
        'color'
      )
    ); // the link shape

    myDiagram.model = new go.TreeModel({
      nodeDataArray: [this.sampleOrgModel(0), this.sampleOrgModel(1)],
    });

    return myDiagram;
  }

  static reloadTemplate(data: ObjStateModel, diagram: go.Diagram) {
    diagram.model = new go.TreeModel({
      nodeDataArray: data.diagramNodeData,
    });

    // make sure new data keys are unique positive integers
    let lastkey = 1;
    diagram.model.makeUniqueKeyFunction = (model, data: any) => {
      let k = data.key || lastkey;
      while (model.findNodeDataForKey(k)) k++;
      data.key = lastkey = k;
      return k;
    };
  }

  static sampleOrgModel(key: string | number, name?: string): OrgModel {
    const obj: OrgModel = {
      key: key,
      name: name ? name : 'EmptyName',
      pic: 'user.png',
      title: 'EmptyTitle',
    };
    return obj;
  }

  // ------------- UTILS ------------------
  // this is used to determine feedback during drags
  static mayWorkFor(node1: go.Node | any, node2: go.Node | any) {
    if (!(node1 instanceof go.Node)) return false; // must be a Node
    if (node1 === node2) return false; // cannot work for yourself
    if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
    return true;
  }

  // This function provides a common style for most of the TextBlocks.
  // Some of these values may be overridden in a particular TextBlock.
  static textStyle() {
    return { font: '9pt  Segoe UI,sans-serif', stroke: 'white' };
  }

  // This converter is used by the Picture.
  static findHeadShot(pic: any) {
    if (!pic) return 'assets/images/orgTree/user.png'; // There are only 16 images on the server
    return 'assets/images/orgTree/' + pic;
  }
}

// ------------------ PROPERTIES
export interface OrgTreeProperties {
  levelColors?: string[];
  shape?: ShapeModel;
  textAddEmploy?: string;
  textVacatePosition?: string;
  textRemoveRole?: string;
  textRemoveDepartment?: string;
}

// ------------------ MAKER
export class OrgTreeMaker {
  static putValues(properties?: OrgTreeProperties) {
    if (properties) {
      if (properties.levelColors) {
        OrgTreeTemplate.levelColors = properties.levelColors;
      }
      if (properties.shape) {
        this.putShape(properties.shape);
      }
      if (properties.textAddEmploy) {
        OrgTreeTemplate.textAddEmploy = properties.textAddEmploy;
      }
      if (properties.textVacatePosition) {
        OrgTreeTemplate.textVacatePosition = properties.textVacatePosition;
      }
      if (properties.textRemoveRole) {
        OrgTreeTemplate.textRemoveRole = properties.textRemoveRole;
      }
      if (properties.textRemoveDepartment) {
        OrgTreeTemplate.textRemoveDepartment = properties.textRemoveDepartment;
      }
    }
  }
  static putShape(shape?: ShapeModel) {
    if (shape) {
      if (shape.type) {
        OrgTreeTemplate.shape.type = shape.type;
      }
      if (shape.background) {
        OrgTreeTemplate.shape.background = shape.background;
      }
      if (shape.borderColor) {
        OrgTreeTemplate.shape.borderColor = shape.borderColor;
      }
      if (shape.borderSize) {
        OrgTreeTemplate.shape.borderSize = shape.borderSize;
      }
    }
  }
}
