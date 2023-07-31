import { GanttModel } from '../../../model/gantt.model';

export class GenericGantt {
  static makeData() {
    const n0: GanttModel = {
      key: 'n0',
      text: 'Project',
    };
    const n1: GanttModel = {
      key: 'n1',
      text: 'Task 1',
      color: 'yellow',
    };

    const n11: GanttModel = {
      key: 'n11',
      text: 'Task 1.1',
      color: 'green',
      duration: 7,
    };

    return [n0, n1, n11];
  }

  static makeLink() {
    return [
      { from: 'n0', to: 'n1' },
      { from: 'n1', to: 'n11' },
    ];
  }
}
