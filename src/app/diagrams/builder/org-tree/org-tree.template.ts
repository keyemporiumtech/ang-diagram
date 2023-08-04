import * as go from 'gojs';
import { OrgTreeProperties } from './properties/org-tree.properties';
import { OrgTreePropertiesMaker } from './properties/org-tree-properties.maker';
import { OrgTreeUtility } from './utility/org-tree.utility';

export class OrgTreeTemplate {
  static make(divDiagramId: string, properties?: OrgTreeProperties) {
    OrgTreePropertiesMaker.setValues(properties);

    const myDiagram = this.makeDiagram(divDiagramId);

    myDiagram.nodeTemplate.contextMenu =
      OrgTreeUtility.standardContextMenus(myDiagram);

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

    return myDiagram;
  }

  static makeDiagram(divId: string): go.Diagram {
    const $ = go.GraphObject.make;

    const myDiagram = new go.Diagram(divId, {
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

    // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
    (myDiagram.layout as any).commitNodes = function () {
      // method override must be function, not =>
      (go.TreeLayout.prototype as any).commitNodes.call(this); // do the standard behavior
      // then go through all of the vertexes and set their corresponding node's Shape.fill
      // to a brush dependent on the TreeVertex.level value
      myDiagram.layout.network?.vertexes.each((v: any) => {
        if (v.node) {
          const level = v.level % OrgTreeUtility.levelColors.length;
          const color = OrgTreeUtility.levelColors[level];
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
          if (!OrgTreeUtility.mayWorkFor(selnode, node)) return;
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
          if (OrgTreeUtility.mayWorkFor(selnode, node)) {
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
        $(go.Shape, (OrgTreeUtility.shape as any).type, {
          name: 'SHAPE',
          fill: (OrgTreeUtility.shape as any).background,
          stroke: (OrgTreeUtility.shape as any).borderColor,
          strokeWidth: (OrgTreeUtility.shape as any).borderSize,
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
              source: OrgTreeUtility.PATH_PIC + '/user.png', // the default image
            },
            new go.Binding('source', 'pic', OrgTreeUtility.findHeadShot)
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
              OrgTreeUtility.textStyle(), // the name
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
            $(go.TextBlock, 'Role: ', OrgTreeUtility.textStyle(), {
              row: 1,
              column: 0,
            }),
            $(
              go.TextBlock,
              OrgTreeUtility.textStyle(),
              {
                row: 1,
                column: 0,
                /*
                columnSpan: 3,
                editable: true,
                isMultiline: false,
                minSize: new go.Size(50, 14),
                margin: new go.Margin(0, 0, 0, 3),
                */
              },
              new go.Binding('text', 'role', (v) => 'Role: ' + v).makeTwoWay()
            ),
            $(
              go.TextBlock,
              OrgTreeUtility.textStyle(),
              { row: 2, column: 0 },
              new go.Binding('text', 'matricola', (v) =>
                v ? 'Matricola: ' + v : ''
              )
            )
            /*
            $(
              go.TextBlock,
              OrgTreeUtility.textStyle(), // the comments
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
            */
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
          click: (e, button) =>
            OrgTreeUtility.addEmployee(button.part, myDiagram),
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
      nodeDataArray: [],
    });

    return myDiagram;
  }

  static oldContextMenu(myDiagram: go.Diagram) {
    const $ = go.GraphObject.make;
    // the context menu allows users to make a position vacant,
    // remove a role and reassign the subtree, or remove a department
    myDiagram.nodeTemplate.contextMenu = $(
      'ContextMenu',
      $('ContextMenuButton', $(go.TextBlock, OrgTreeUtility.textAddEmploy), {
        click: (e, button) =>
          OrgTreeUtility.addEmployee(
            (button.part as any).adornedPart,
            myDiagram
          ),
      }),
      $(
        'ContextMenuButton',
        $(go.TextBlock, OrgTreeUtility.textVacatePosition),
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
      $('ContextMenuButton', $(go.TextBlock, OrgTreeUtility.textRemoveRole), {
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
        $(go.TextBlock, OrgTreeUtility.textRemoveDepartment),
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
  }
}
