import * as go from 'gojs';
import { EnumFigureType } from '../../../../shared/enum/figure-type.enum';
import { ShapeModel } from '../../../model/shape.model';
import { ModalUtility } from '../../shared-modal/modal.utility';
import { OrgModel } from '../../../model/org.model';

export class OrgTreeUtility {
  static levelColors: string[] = [
    '#AC193D',
    '#2672EC',
    '#8C0095',
    '#5133AB',
    '#008299',
    '#D24726',
    '#008A00',
    '#094AB2',
  ];
  static shape: ShapeModel = {
    type: EnumFigureType.RETTANGOLO,
    background: '#333333',
    borderColor: 'white',
    borderSize: 3.5,
  };
  static textAddEmploy: string = 'Add Employee';
  static textVacatePosition: string = 'Vacate Position';
  static textRemoveRole: string = 'Remove Role';
  static textRemoveDepartment: string = 'Remove Department';

  static PATH_PIC = 'assets/images/orgTree';

  static addEmployee(node: any, myDiagram: go.Diagram) {
    if (!node) return;
    const thisemp = node.data;
    myDiagram.startTransaction('add employee');
    const newemp = {
      name: '(new person)',
      title: '(title)',
      comments: '',
      parent: thisemp.key,
    };
    myDiagram.model.addNodeData(newemp);
    const newnode: any = myDiagram.findNodeForData(newemp);
    if (newnode) newnode.location = node.location;
    myDiagram.commitTransaction('add employee');
    myDiagram.commandHandler.scrollToPart(newnode);
  }

  // this is used to determine feedback during drags
  static mayWorkFor(node1: go.Node | any, node2: go.Node | any) {
    if (!(node1 instanceof go.Node)) return false; // must be a Node
    if (node1 === node2) return false; // cannot work for yourself
    if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
    return true;
  }

  // This function provides a common style for most of the TextBlocks.
  // Some of these values may be overridden in a particular TextBlock.
  static textStyle() {
    return { font: '9pt  Segoe UI,sans-serif', stroke: 'white' };
  }

  // This converter is used by the Picture.
  static findHeadShot(pic: any) {
    if (!pic) return OrgTreeUtility.PATH_PIC + '/user.png'; // There are only 16 images on the server
    return OrgTreeUtility.PATH_PIC + '/' + pic;
  }

  static standardContextMenus(myDiagram: go.Diagram) {
    const $ = go.GraphObject.make;
    return $(
      'ContextMenu',
      $('ContextMenuButton', $(go.TextBlock, 'Details...'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;
          OrgTreeUtility.contentDetail(task.data, myDiagram);
          ModalUtility.openModal();
        },
      }),
      $('ContextMenuButton', $(go.TextBlock, 'New Task'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;

          OrgTreeUtility.contentSave(task.data);
          ModalUtility.openModal();
        },
      }),
      $('ContextMenuButton', $(go.TextBlock, 'Edit'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;

          OrgTreeUtility.contentUpdate(task.data);
          ModalUtility.openModal();
        },
      })
    );
  }

  static contentDetail(data: OrgModel, myDiagram: go.Diagram) {
    ModalUtility.hideSave();
    ModalUtility.setTitle(data.name);

    const parentnode: any = myDiagram.model.findNodeDataForKey(data.parent);

    let html = '';

    if (data.pic) {
      html +=
        '<div style="width: 3rem"><img class="img-fluid" src="' +
        OrgTreeUtility.PATH_PIC +
        '/' +
        data.pic +
        '"/></div>';
    }

    html += '<strong>Ruolo</strong>: ' + data.role;
    if (parentnode) {
      html += '<br/><strong >Parent</strong>: ' + parentnode.name;
      html += '<br/><strong >Parent Role</strong>: ' + parentnode.role;
    }

    ModalUtility.setDetail(html);
  }

  static contentSave(data: OrgModel) {
    ModalUtility.setDataDetail(data);
    ModalUtility.showSave();
    ModalUtility.hideUpdate();
    ModalUtility.setEditing();
    ModalUtility.setTitle('Nuovo Task');
  }

  static contentUpdate(data: OrgModel) {
    ModalUtility.setDataUpdate(data);
    ModalUtility.hideSave();
    ModalUtility.showUpdate();
    ModalUtility.setEditing();
    ModalUtility.setTitle('Modifica ' + data.text);
  }
}
