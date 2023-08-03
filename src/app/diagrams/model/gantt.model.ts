import { StateNodeModel } from '../../shared/model/state-node.model';

export interface GanttModel extends StateNodeModel {
  key: string | number | undefined;
  text: string;
  color?: string; // preferr to use hexa not name as yellow
  start?: number;
  duration?: number;
}
