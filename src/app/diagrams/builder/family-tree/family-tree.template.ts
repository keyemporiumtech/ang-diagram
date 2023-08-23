import * as go from 'gojs';
import { FamilyTreeUtility } from './utility/family-tree.utility';
import { FamilyTreePropertiesMaker } from './properties/family-tree-properties.maker';
import { FamilyTreeProperties } from './properties/family-tree-properties';

export class FamilyTreeTemplate {
  static make(
    divDiagramId: string,
    properties?: FamilyTreeProperties
  ): go.Diagram {
    FamilyTreePropertiesMaker.setValues(properties);

    const myDiagram = this.makeDiagram(divDiagramId);
    myDiagram.nodeTemplate.contextMenu =
      FamilyTreeUtility.standardContextMenus(myDiagram);
    myDiagram.nodeTemplate.toolTip = FamilyTreeUtility.makeTooltip();

    return myDiagram;
  }

  static makeDiagram(divId: string) {
    const $ = go.GraphObject.make;

    const myDiagram = new go.Diagram(
      divId, // must be the ID or reference to div
      {
        'toolManager.hoverDelay': 100, // 100 milliseconds instead of the default 850
        allowCopy: false,
        // create a TreeLayout for the family tree
        layout: $(go.TreeLayout, {
          angle: 90,
          nodeSpacing: 10,
          layerSpacing: 40,
          layerStyle: go.TreeLayout.LayerUniform,
        }),
      }
    );

    myDiagram.add(
      $(
        go.Part,
        'Table',
        { position: new go.Point(500, 10), selectable: false },
        $(go.TextBlock, 'Key', {
          row: 0,
          font: '700 14px Droid Serif, sans-serif',
        }), // end row 0
        $(
          go.Panel,
          'Horizontal',
          { row: 1, alignment: go.Spot.Left },
          $(go.Shape, FamilyTreeUtility.typeShape, {
            desiredSize: new go.Size(30, 30),
            fill: FamilyTreeUtility.maleColor,
            margin: 5,
          }),
          $(go.TextBlock, FamilyTreeUtility.textMales, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ), // end row 1
        $(
          go.Panel,
          'Horizontal',
          { row: 2, alignment: go.Spot.Left },
          $(go.Shape, FamilyTreeUtility.typeShape, {
            desiredSize: new go.Size(30, 30),
            fill: FamilyTreeUtility.femaleColor,
            margin: 5,
          }),
          $(go.TextBlock, FamilyTreeUtility.textFemales, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ) // end row 2
      )
    );

    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { deletable: false },
      new go.Binding('text', 'name'),
      $(
        go.Shape,
        'Rectangle',
        {
          fill: 'lightgray',
          stroke: null,
          strokeWidth: 0,
          stretch: go.GraphObject.Fill,
          alignment: go.Spot.Center,
        },
        new go.Binding('fill', 'gender', FamilyTreeUtility.genderBrushConverter)
      ),
      $(
        go.TextBlock,
        {
          font: '700 12px Droid Serif, sans-serif',
          textAlign: 'center',
          margin: 10,
          maxSize: new go.Size(80, NaN),
        },
        new go.Binding('text', '', FamilyTreeUtility.textConvert)
      )
    );

    myDiagram.linkTemplate = $(
      go.Link, // the whole link panel
      { routing: go.Link.Orthogonal, corner: 5, selectable: false },
      $(go.Shape, { strokeWidth: 3, stroke: '#424242' }).bind(
        'stroke',
        'color'
      ),
      $(go.Shape, { toArrow: 'Standard', scale: 1.5 }),
      $(go.TextBlock, { margin: new go.Margin(5, 0, 0, 0) }).bind('text')
    );

    myDiagram.model = new go.GraphLinksModel({
      nodeKeyProperty: 'key',
      linkToPortIdProperty: 'toPort',
      linkFromPortIdProperty: 'fromPort',
      linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksMode
    });

    return myDiagram;
  }
}
