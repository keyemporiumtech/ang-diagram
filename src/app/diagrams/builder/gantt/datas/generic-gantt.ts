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
      color: '#F1E904',
    };

    const n11: GanttModel = {
      key: 'n11',
      text: 'Task 1.1',
      color: '#39C31D',
      duration: 7,
    };
    const n2: GanttModel = {
      key: 'n2',
      text: 'Task 2',
      color: '#ff0000',
      start: 7,
      duration: 15,
    };

    return [n0, n1, n11, n2];
  }

  static makeLink() {
    return [
      { key: 'n0n1', from: 'n0', to: 'n1' },
      { key: 'n1n11', from: 'n1', to: 'n11' },
      { key: 'n0n2', from: 'n0', to: 'n2' },
    ];
  }
}
