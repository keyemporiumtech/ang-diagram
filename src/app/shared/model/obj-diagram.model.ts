import { ObjStateModel } from './obj-state.model';
import * as go from 'gojs';
export class ObjDiagramModel {
  state: ObjStateModel = {};
  title: string = '';
  divId: string = 'myDivDiagram';
  filename: string = 'MyDiagram.png';
  filenames?: string[];
  // utility
  diagram?: () => go.Diagram;
  flgInspector: boolean = false;
  flgPalette: boolean = false;
  flgOverview: boolean = false;
  flgInfo: boolean = false;
  orientation?: 'Auto' | 'Vertical' | 'Horizontal' | undefined = 'Auto';
}
