import * as go from 'gojs';
import { GanttModel } from '../../../model/gantt.model';
import { ModalUtility } from '../../shared-modal/modal.utility';

export class GanttUtility {
  static GridCellHeight = 20; // document units; cannot be changed dynamically
  static GridCellWidth = 12; // document units per day; this can be modified -- see rescale()
  static TimelineHeight = 24; // document units; cannot be changed dynamically

  static MsPerDay = 24 * 60 * 60 * 1000;
  static StartDate = new Date();
  static TREEWIDTH = 160;

  static changingView = false;

  static convertDaysToUnits(n: any) {
    return n;
  }

  static convertUnitsToDays(n: any) {
    return n;
  }

  static convertStartToX(start: any) {
    return GanttUtility.convertUnitsToDays(start) * GanttUtility.GridCellWidth;
  }

  static convertXToStart(x: any, node?: any) {
    return GanttUtility.convertDaysToUnits(x / GanttUtility.GridCellWidth);
  }

  // these four functions are used in TwoWay Bindings on the task/node template
  static convertDurationToW(duration: any) {
    return (
      GanttUtility.convertUnitsToDays(duration) * GanttUtility.GridCellWidth
    );
  }

  static convertWToDuration(w: any) {
    return GanttUtility.convertDaysToUnits(w / GanttUtility.GridCellWidth);
  }

  static convertStartToPosition(start: any, node: any) {
    return new go.Point(
      GanttUtility.convertStartToX(start),
      node.position.y || 0
    );
  }

  static convertPositionToStart(pos: any) {
    return GanttUtility.convertXToStart(pos.x);
  }

  static valueToText(n: any) {
    // N document units after StartDate
    const startDate = GanttUtility.StartDate;
    const startDateMs =
      startDate.getTime() + startDate.getTimezoneOffset() * 60000;
    const date = new Date(
      startDateMs + (n / GanttUtility.GridCellWidth) * GanttUtility.MsPerDay
    );
    return date.toLocaleDateString();
  }

  static dateToValue(d: any) {
    // D is a Date
    const startDate = GanttUtility.StartDate;
    const startDateMs =
      startDate.getTime() + startDate.getTimezoneOffset() * 60000;
    const dateInMs = d.getTime() + d.getTimezoneOffset() * 60000;
    const msSinceStart = dateInMs - startDateMs;
    return (msSinceStart / GanttUtility.MsPerDay) * GanttUtility.GridCellWidth;
  }

  static updateNodeWidths(task: go.Diagram, taskHeader: go.Part, width: any) {
    let minx = Infinity;
    task.nodes.each((n) => {
      if (n instanceof go.Node) {
        minx = Math.min(minx, n.actualBounds.x);
      }
    });
    if (minx === Infinity) return;
    const right = minx + width;
    task.nodes.each((n) => {
      if (n instanceof go.Node) {
        n.width = Math.max(0, right - n.actualBounds.x);
        n.getColumnDefinition(1).width =
          GanttUtility.TREEWIDTH - n.actualBounds.x;
      }
    });
    taskHeader.getColumnDefinition(1).width =
      GanttUtility.TREEWIDTH - taskHeader.actualBounds.x;
  }

  static standardContextMenus(): any {
    const $ = go.GraphObject.make;
    return $(
      'ContextMenu',
      $('ContextMenuButton', $(go.TextBlock, 'Details...'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;
          GanttUtility.contentDetail(task.data);
          ModalUtility.openModal();
        },
      }),
      $('ContextMenuButton', $(go.TextBlock, 'New Task'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;

          GanttUtility.contentSave(task.data);
          ModalUtility.openModal();
        },
      }),
      $('ContextMenuButton', $(go.TextBlock, 'Edit'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;

          GanttUtility.contentUpdate(task.data);
          ModalUtility.openModal();
        },
      })
    );
  }

  static contentDetail(data: GanttModel) {
    ModalUtility.hideSave();
    ModalUtility.hideUpdate();

    const init = new Date(GanttUtility.StartDate.getTime());
    if (data.start) {
      init.setDate(init.getDate() + data.start);
    }

    let end = undefined;
    if (data.duration) {
      end = new Date(init.getTime());
      end.setDate(init.getDate() + data.duration);
    }

    data.init = init;
    data.end = end;

    ModalUtility.setDataDetail(data);
    ModalUtility.setDetail();
    ModalUtility.setTitle(data.text);

    /*
    let html = '<strong>start</strong>: ' + init.toLocaleDateString();
    if (end) {
      html += '<br/><strong>end</strong>: ' + end.toLocaleDateString();
    }
    if (data.color) {
      html +=
        '<br/><strong style="display: inline-flex;">color</strong>: <div style="display: inline-flex; width: 5rem; height: 1rem; background-color:' +
        data.color +
        '"></div>';
    }
    ModalUtility.setDetail(html);
    */
  }

  static contentSave(data: GanttModel) {
    ModalUtility.showSave();
    ModalUtility.hideUpdate();

    ModalUtility.setDataSave(data);
    ModalUtility.setSave();
    ModalUtility.setTitle('Nuovo Task');
  }

  static contentUpdate(data: GanttModel) {
    ModalUtility.hideSave();
    ModalUtility.showUpdate();

    ModalUtility.setDataUpdate(data);
    ModalUtility.setUpdate();
    ModalUtility.setTitle('Modifica ' + data.text);
  }
}
