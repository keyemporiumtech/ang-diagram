import { ObjStateModel } from './obj-state.model';
import * as go from 'gojs';
export class ObjDiagramModel {
  state: ObjStateModel = {};
  diagram?: () => go.Diagram;
  title: string = '';
  flgInspector: boolean = false;
  flgPalette: boolean = false;
  flgOverview: boolean = false;
  flgInfo: boolean = false;
  orientation?: 'Auto' | 'Vertical' | 'Horizontal' | undefined = 'Auto';
}
