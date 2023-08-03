import { GanttUtility } from '../utility/gantt.utility';
import { GanttProperties } from './gantt.properties';

export class GanttPropertiesMaker {
  static setValues(properties?: GanttProperties) {
    if (properties && properties.startDate) {
      GanttUtility.StartDate = properties.startDate;
    }
  }
}
