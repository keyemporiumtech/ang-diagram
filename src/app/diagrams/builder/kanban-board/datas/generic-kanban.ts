import { EnumKanbanStatus, KanbanModel } from '../../../model/kanban.model';

export class GenericKanban {
  static makeData() {
    const n0: KanbanModel = {
      key: 'n0',
      text: 'First step',
      isGroup: true,
      color: EnumKanbanStatus.NONE,
    };
    const n1: KanbanModel = {
      key: 'n1',
      text: 'Second step',
      isGroup: true,
      color: EnumKanbanStatus.NONE,
    };

    const n01: KanbanModel = {
      key: 'n01',
      text: 'Activity 1',
      color: EnumKanbanStatus.COMPLETED,
      group: 'n0',
    };
    const n02: KanbanModel = {
      key: 'n02',
      text: 'Activity 2',
      color: EnumKanbanStatus.IN_PROGRESS,
      group: 'n0',
    };

    return [n0, n1, n01, n02];
  }

  static makeLink() {
    return [];
  }
}
