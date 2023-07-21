import * as go from 'gojs';
import { EnumFigureType } from '../enum/figure-type.enum';

export interface StateNodeModel {
  key?: string | number;
  width?: number;
  height?: number;
  background?: string;
  type?: EnumFigureType | string;
  border?: { color: string; size: number; cap?: string; join?: string };
  posizion?: string; // example 5 20
  margin?: go.Margin;
  // text
  font?: string;
  possibleValues?: string[];
  multiline?: boolean;
  lineThrough?: boolean;
  underline?: boolean;
  spacing?: number;
  text?: string;
  textAlign?: 'left' | 'right' | 'center' | 'end' | 'start';
  textMargin?: go.Margin;
  // group
  isGroup?: boolean;
  group?: string;
}
