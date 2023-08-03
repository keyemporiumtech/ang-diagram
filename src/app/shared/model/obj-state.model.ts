import { StateLinkModel } from './state-link.model';
import { StateNodeModel } from './state-node.model';

export interface ObjStateModel {
  diagramNodeData?: StateNodeModel[];
  diagramLinkData?: StateLinkModel[];
  diagramModelData?: any;
  skipsDiagramUpdate?: boolean;
}
