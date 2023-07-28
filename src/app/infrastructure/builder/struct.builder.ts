import * as go from 'gojs';
import { EnumFigureType } from '../../shared/enum/figure-type.enum';
import { StateNodeModel } from '../../shared/model/state-node.model';
import { ObjDiagramModel } from '../../shared/model/obj-diagram.model';
import { StateLinkModel } from '../../shared/model/state-link.model';
import { EnumNodeTemplate } from '../../shared/enum/node-template.enum';
import { DiagramBuilder } from '../../shared/builder/diagram.builder';

export class StructBuilder {
  static makeDiagramNodeTemplate(
    nodeOrientation?: 'Auto' | 'Vertical' | 'Horizontal' | undefined,
    tp?: EnumNodeTemplate
  ) {
    let node;
    switch (tp) {
      case EnumNodeTemplate.NORMAL:
      default:
        node = DiagramBuilder.makeNode(nodeOrientation);
        node.add(DiagramBuilder.makeShape());
        node.add(DiagramBuilder.makeText());
        break;
      case EnumNodeTemplate.WITH_IMAGE:
        node = DiagramBuilder.makeNodePicture(nodeOrientation, { stroke: 2 });
        // node.add(DiagramBuilder.makeShape());
        node.add(DiagramBuilder.makePicture());
        node.add(DiagramBuilder.makeText());
        // node.add(part);
        break;
    }
    return node;
  }

  static makeDiagramModel(
    title?: string,
    orientation?: 'Auto' | 'Vertical' | 'Horizontal' | undefined,
    initData?: StateNodeModel[],
    initLink?: StateLinkModel[]
  ): ObjDiagramModel {
    const model = new ObjDiagramModel();
    model.title = title ? title : '';
    model.flgInfo = false;
    model.flgInspector = false;
    model.flgOverview = false;
    model.flgPalette = false;

    model.orientation = orientation ? orientation : 'Horizontal';

    model.state = { diagramNodeData: [], diagramLinkData: [] };
    if (initData) {
      model.state.diagramNodeData?.push(...initData);
    }
    if (initLink) {
      model.state.diagramLinkData?.push(...initLink);
    }

    return model;
  }

  static link(
    from: string,
    to: string,
    pFrom?: 'L' | 'R' | 'T' | 'B',
    pTo?: 'L' | 'R' | 'T' | 'B',
    text?: string,
    color?: string,
    size?: number,
    arrowColor?: string,
    arrowSize?: number,
    curve?:
      | typeof go.Link.Bezier
      | typeof go.Link.JumpGap
      | typeof go.Link.JumpOver
      | typeof go.Link.None
  ): StateLinkModel {
    const obj: StateLinkModel = {
      from: from,
      to: to,
    };
    if (pFrom) {
      switch (pFrom) {
        case 'L':
          obj.fromSpot = go.Spot.Left;
          break;
        case 'R':
          obj.fromSpot = go.Spot.Right;
          break;
        case 'T':
          obj.fromSpot = go.Spot.Top;
          break;
        case 'B':
          obj.fromSpot = go.Spot.Bottom;
          break;
      }
    }

    if (pTo) {
      switch (pTo) {
        case 'L':
          obj.toSpot = go.Spot.Left;
          break;
        case 'R':
          obj.toSpot = go.Spot.Right;
          break;
        case 'T':
          obj.toSpot = go.Spot.Top;
          break;
        case 'B':
          obj.toSpot = go.Spot.Bottom;
          break;
      }
    }
    if (text) {
      obj.text = text;
    }
    if (color) {
      obj.color = color;
    }
    if (size) {
      obj.size = size;
    }

    if (arrowColor) {
      obj.arrowColor = arrowColor;
    }
    if (arrowSize) {
      obj.arrowSize = arrowSize;
    }

    if (curve) {
      obj.curve = curve;
    }

    return obj;
  }

  static linkBidirectional(
    from: string,
    to: string,
    direction: 'LR' | 'RL' | 'TB' | 'BT',
    text?: string,
    color?: string,
    size?: number,
    arrowColor?: string,
    arrowSize?: number,
    curve?:
      | typeof go.Link.Bezier
      | typeof go.Link.JumpGap
      | typeof go.Link.JumpOver
      | typeof go.Link.None
  ): StateLinkModel[] {
    let fromSpot: 'L' | 'R' | 'T' | 'B';
    let toSpot: 'L' | 'R' | 'T' | 'B';
    switch (direction) {
      case 'LR':
        fromSpot = 'L';
        toSpot = 'R';
        break;
      case 'RL':
        fromSpot = 'R';
        toSpot = 'L';
        break;
      case 'TB':
        fromSpot = 'T';
        toSpot = 'B';
        break;
      case 'BT':
        fromSpot = 'B';
        toSpot = 'T';
        break;
    }

    const linkFrom = this.link(
      from,
      to,
      fromSpot,
      toSpot,
      text,
      color,
      size,
      arrowColor,
      arrowSize,
      curve
    );
    const linkTo = this.link(
      to,
      from,
      toSpot,
      fromSpot,
      text,
      color,
      size,
      arrowColor,
      arrowSize,
      curve
    );

    return [linkFrom, linkTo];
  }

  static makeNodeData(
    key: string,
    background: string,
    text: string,
    font?: string,
    type?: string,
    border?: { color: string; size: number; cap?: string; join?: string },
    position?: string,
    img?: { source?: string; width?: number; height?: number }
  ): StateNodeModel {
    const obj: StateNodeModel = {
      key: key,
      background: background,
      type: type ? type : EnumFigureType.ARROTONDATO.toString(),
      font: font ? font : 'Times',
      text: text,
    };
    if (border && border.color) {
      obj.borderColor = border.color;
    }
    if (border && border.size) {
      obj.borderSize = border.size;
    }
    if (border && border.cap) {
      obj.borderCap = border.cap;
    }
    if (border && border.join) {
      obj.borderJoin = border.join;
    }

    if (position) {
      obj.posizion = position;
    }
    if (img && img.source) {
      obj.img = img.source;
    }
    if (img && img.width) {
      obj.imgWidth = img.width;
    }
    if (img && img.height) {
      obj.imgHeight = img.height;
    }

    if (img && img.width && img.height) {
      // obj.imgMargin = new go.Margin(-50, -50, -50, -60);
      // obj.width = img.width + 20;
      // obj.height = img.height + 20;
    }
    return obj;
  }

  static makeNodeGroup(
    key: string,
    background: string,
    text: string,
    font?: string,
    type?: string,
    border?: { color: string; size: number; cap?: string; join?: string },
    position?: string
  ): StateNodeModel {
    const obj: StateNodeModel = this.makeNodeData(
      key,
      background,
      text,
      font,
      type,
      border,
      position
    );
    obj.isGroup = true;
    return obj;
  }

  static putInGroup(obj: StateNodeModel, group: string): StateNodeModel {
    obj.group = group;
    return obj;
  }
}
