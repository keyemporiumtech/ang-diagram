import * as go from 'gojs';
import { EnumFigureType } from '../../shared/enum/figure-type.enum';
import { StateNodeModel } from '../../shared/model/state-node.model';
import { ObjDiagramModel } from '../../shared/model/obj-diagram.model';
import { StateLinkModel } from '../../shared/model/state-link.model';

export class StructBuilder {
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
    position?: string
  ): StateNodeModel {
    const obj: StateNodeModel = {
      key: key,
      background: background,
      type: type ? type : EnumFigureType.ARROTONDATO.toString(),
      font: font ? font : 'Times',
      text: text,
    };
    if (border) {
      obj.border = border;
    }
    if (position) {
      obj.posizion = position;
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
