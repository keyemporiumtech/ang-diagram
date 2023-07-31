import { StateNodeModel } from '../../shared/model/state-node.model';
export interface KanbanModel extends StateNodeModel {
  key: number | string;
  color: EnumKanbanStatus;
  isGroup?: boolean;
  group?: string;
  text: string;
  loc?: string;
}

export enum EnumKanbanStatus {
  NONE = '0',
  STOPPED = '1',
  IN_PROGRESS = '2',
  COMPLETED = '3',
}
