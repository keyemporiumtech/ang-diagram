import * as go from 'gojs';
import { ShapeModel } from '../../../model/shape.model';
import { EnumFigureType } from '../../../../shared/enum/figure-type.enum';
import { ModalUtility } from '../../shared-modal/modal.utility';
import { EnumKanbanStatus, KanbanModel } from '../../../model/kanban.model';

export class KanbanUtility {
  static noteColors = ['lightgray', '#CC293D', '#FFD700', '#009CCC'];
  static shapeGroup: ShapeModel = {
    type: EnumFigureType.RETTANGOLO,
    background: '#009CCC',
    borderColor: '#009CCC',
    borderSize: 1,
  };
  static shapeNode: ShapeModel = {
    type: EnumFigureType.RETTANGOLO,
    background: 'white',
    borderColor: '#CCCCCC',
  };
  static textStatusSTOP: { color: string; text: string } = {
    color: '#CC293D',
    text: 'Stopped',
  };
  static textStatusPROGRESS: { color: string; text: string } = {
    color: '#FFD700',
    text: 'In Progress',
  };
  static textStatusCOMPLETE: { color: string; text: string } = {
    color: '#009CCC',
    text: 'Completed',
  };

  // this is called after nodes have been moved
  static relayoutDiagram(myDiagram: go.Diagram) {
    myDiagram.selection.each((n) => n.invalidateLayout());
    myDiagram.layoutDiagram();
  }

  // There are only three note colors by default, blue, red, and yellow but you could add more here:
  static getNoteColor(num: any) {
    return KanbanUtility.noteColors[
      Math.min(num, KanbanUtility.noteColors.length - 1)
    ];
  }

  // While dragging, highlight the dragged-over group
  static highlightGroup(grp: any, show: any, myDiagram: go.Diagram) {
    if (show) {
      const part = myDiagram.toolManager.draggingTool.currentPart;
      if (part?.containingGroup !== grp) {
        grp.isHighlighted = true;
        return;
      }
    }
    grp.isHighlighted = false;
  }

  static standardContextMenus() {
    const $ = go.GraphObject.make;
    return {
      contextMenu: $(
        'ContextMenu',
        $('ContextMenuButton', $(go.TextBlock, 'Details...'), {
          click: (e, button) => {
            const task = (button.part as any).adornedPart;
            KanbanUtility.contentDetail(task.data);
            ModalUtility.openModal();
          },
        }),
        $('ContextMenuButton', $(go.TextBlock, 'New Task'), {
          click: (e, button) => {
            const task = (button.part as any).adornedPart;

            KanbanUtility.contentSave(task.data);
            ModalUtility.openModal();
          },
        }),
        $('ContextMenuButton', $(go.TextBlock, 'Edit'), {
          click: (e, button) => {
            const task = (button.part as any).adornedPart;

            KanbanUtility.contentUpdate(task.data);
            ModalUtility.openModal();
          },
        })
      ),
    };
  }

  static contentDetail(data: KanbanModel) {
    ModalUtility.hideSave();
    ModalUtility.setTitle(data.text);

    let statusColor = KanbanUtility.noteColors[0];
    let statusText: string;
    switch (data.color) {
      case EnumKanbanStatus.NONE:
      default:
        statusColor = KanbanUtility.noteColors[0];
        statusText = 'Not defined';
        break;
      case EnumKanbanStatus.COMPLETED:
        statusColor = KanbanUtility.textStatusCOMPLETE.color;
        statusText = KanbanUtility.textStatusCOMPLETE.text;
        break;
      case EnumKanbanStatus.IN_PROGRESS:
        statusColor = KanbanUtility.textStatusPROGRESS.color;
        statusText = KanbanUtility.textStatusPROGRESS.text;
        break;
      case EnumKanbanStatus.STOPPED:
        statusColor = KanbanUtility.textStatusSTOP.color;
        statusText = KanbanUtility.textStatusSTOP.text;
        break;
    }

    let html =
      '<strong style="display: inline-flex;">Status</strong>: ' +
      statusText +
      ' <div style="display: inline-flex; width: 5rem; height: 1rem; background-color:' +
      statusColor +
      '"></div>';

    ModalUtility.setDetail(html);
  }

  static contentSave(data: KanbanModel) {
    ModalUtility.setDataUpdate(data);
    ModalUtility.showSave();
    ModalUtility.hideUpdate();
    ModalUtility.setEditing();
    ModalUtility.setTitle('Nuovo Task');
  }

  static contentUpdate(data: KanbanModel) {
    ModalUtility.setDataUpdate(data);
    ModalUtility.hideSave();
    ModalUtility.showUpdate();
    ModalUtility.setEditing();
    ModalUtility.setTitle('Modifica ' + data.text);
  }
}
