import * as go from 'gojs';

export interface StateLinkModel {
  key?: string | number;
  from?: string | number;
  to?: string | number;
  fromSpot?: go.Spot;
  toSpot?: go.Spot;
  curve?:
    | typeof go.Link.Bezier
    | typeof go.Link.JumpGap
    | typeof go.Link.JumpOver
    | typeof go.Link.None;
  routing?:
    | typeof go.Link.Normal
    | typeof go.Link.Orthogonal
    | typeof go.Link.AvoidsNodes;
  text?: string;
  color?: string;
  size?: number;
  arrowColor?: string;
  arrowSize?: number;
  category?: string;
}
