import { StateNodeModel } from '../../shared/model/state-node.model';
export interface KanbanModel extends StateNodeModel {
  key: number | string | undefined;
  start?: string;
  end?: string;
  color: EnumKanbanStatus;
  isGroup?: boolean;
  group?: string;
  text: string;
  loc?: string;
  percent?: number;
  persons?: any[];

  statusColor?: string;
  statusText?: string;
}

export enum EnumKanbanStatus {
  NONE = '0',
  STOPPED = '1',
  IN_PROGRESS = '2',
  COMPLETED = '3',
}
