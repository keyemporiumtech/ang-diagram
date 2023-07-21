import { ObjStateModel } from './obj-state.model';

export class ObjDiagramModel {
  state: ObjStateModel | any;
  title: string = '';
  flgInspector: boolean = false;
  flgPalette: boolean = false;
  flgOverview: boolean = false;
  flgInfo: boolean = false;
  orientation?: 'Auto' | 'Vertical' | 'Horizontal' | undefined = 'Auto';
}
