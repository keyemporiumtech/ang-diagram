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

  static makeShape(): go.Shape {
    return new go.Shape()
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

  static makeText(): go.TextBlock {
    return new go.TextBlock()
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

  static makeLink(): go.Link {
    return new go.Link({ fromSpot: go.Spot.Left, toSpot: go.Spot.Right })
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
