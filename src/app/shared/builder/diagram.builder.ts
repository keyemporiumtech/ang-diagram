import * as go from 'gojs';

export class DiagramBuilder {
  static makerInstance() {
    return go.GraphObject.make;
  }
  static makeDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true,
    });
    return dia;
  }

  static makeModel(): go.GraphLinksModel {
    return new go.GraphLinksModel({
      nodeKeyProperty: 'key',
      linkToPortIdProperty: 'toPort',
      linkFromPortIdProperty: 'fromPort',
      linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksMode
    });
  }

  static makeNode(
    type: 'Auto' | 'Vertical' | 'Horizontal' | undefined
  ): go.Node {
    return new go.Node(type).bind('location', 'position', go.Point.parse);
  }

  static makeGroup(type: 'Auto' | 'Vertical' | 'Horizontal' | undefined) {
    return new go.Group(type)
      .add(
        new go.Panel('Auto')
          .add(this.makeShape({ parameter1: 14 }))
          .add(new go.Placeholder({ padding: 25 }))
      )
      .add(
        this.makeText({
          font: 'Bold 12pt Sans-Serif',
          margin: new go.Margin(5, 5, 5, 5),
        })
      );
  }

  static makeShape(init?: any): go.Shape {
    return new go.Shape(init)
      .bind('width')
      .bind('height')
      .bind('fill', 'background') // binds the data.color to shape.fill
      .bind('figure', 'type')
      .bind('stroke', 'border-color')
      .bind('strokeWidth', 'border-size')
      .bind('strokeCap', 'border-cap')
      .bind('strokeJoin', 'border-join')
      .bind('margin');
  }

  static makeText(init?: any): go.TextBlock {
    return new go.TextBlock(init ? init : { margin: new go.Margin(5, 5, 5, 5) })
      .bind('font')
      .bind('choices', 'possibleValues')
      .bind('isMultiline', 'multiline')
      .bind('isStrikethrough', 'lineThrough')
      .bind('isUnderline', 'underline')
      .bind('spacingAbove', 'spacing')
      .bind('text')
      .bind('textAlign', 'textAlign')
      .bind('margin', 'textMargin');
  }

  static makeLink(init?: any): go.Link {
    return new go.Link(
      init ? init : { fromSpot: go.Spot.Left, toSpot: go.Spot.Right }
    )
      .bind('curve')
      .bind('routing')
      .bind('fromSpot')
      .bind('toSpot')
      .add(
        new go.Shape({
          strokeWidth: 1.5,
        })
          .bind('stroke', 'color')
          .bind('strokeWidth', 'size')
      )
      .add(
        new go.Shape({
          toArrow: 'Standard',
          scale: 1.5,
        })
          .bind('fill', 'arrowColor')
          .bind('scale', 'arrowSize')
      )
      .add(new go.TextBlock().bind('text'));
  }
}
