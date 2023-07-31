import { StateNodeModel } from '../../shared/model/state-node.model';

export interface GanttModel extends StateNodeModel {
  key: string | number;
  text: string;
  color?: string;
  start?: number;
  duration?: number;
}
