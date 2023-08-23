import * as go from 'gojs';
import { EnumFigureType } from '../../../../shared/enum/figure-type.enum';
import { FamilyModel } from '../../../model/family.model';
import { ModalUtility } from '../../shared-modal/modal.utility';

export class FamilyTreeUtility {
  static maleColor: string = '#90CAF9';
  static femaleColor: string = '#F48FB1';
  static typeShape: EnumFigureType = EnumFigureType.RETTANGOLO;
  static textMales: string = 'Males';
  static textFemales: string = 'Females';

  static makeTooltip(): any {
    const $ = go.GraphObject.make;
    return $(
      'ToolTip',
      { 'Border.fill': 'whitesmoke', 'Border.stroke': 'black' },
      $(
        go.Panel,
        'Table',
        $(
          go.TextBlock,
          {
            font: 'bold 10pt Helvetica, bold Arial, sans-serif',
            wrap: go.TextBlock.WrapFit,
            margin: 5,
            row: 0,
          },
          new go.Binding('text', '', FamilyTreeUtility.textTooltipConvert)
        )
      )
    );
  }

  static textConvert(person: FamilyModel) {
    var str = person.name;
    str += '\nBorn: ' + person.birthDate?.getFullYear();
    return str;
  }

  static textTooltipConvert(person: FamilyModel) {
    var str = '';
    str += 'Born: ' + person.birthDate?.toLocaleDateString();
    if (person.deathDate !== undefined)
      str += '\nDied: ' + person.deathDate.toLocaleDateString();
    return str;
  }

  static genderBrushConverter = (gender: 'M' | 'F') => {
    if (gender === 'M') return this.maleColor;
    if (gender === 'F') return this.femaleColor;
    return 'orange';
  };

  static standardContextMenus(myDiagram: go.Diagram) {
    const $ = go.GraphObject.make;
    return $(
      'ContextMenu',
      $('ContextMenuButton', $(go.TextBlock, 'Detail'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;
          FamilyTreeUtility.contentDetail(task.data, myDiagram);
          ModalUtility.openModal();
        },
      }),
      $('ContextMenuButton', $(go.TextBlock, 'Edit'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;

          FamilyTreeUtility.contentUpdate(task.data);
          ModalUtility.openModal();
        },
      }),
      $('ContextMenuButton', $(go.TextBlock, 'New Task'), {
        click: (e, button) => {
          const task = (button.part as any).adornedPart;

          FamilyTreeUtility.contentSave(task.data);
          ModalUtility.openModal();
        },
      })
    );
  }

  static contentDetail(data: FamilyModel, myDiagram: go.Diagram) {
    ModalUtility.hideSave();
    ModalUtility.hideUpdate();

    if (data.father) {
      const fathernode: any = myDiagram.model.findNodeDataForKey(data.father);
      data.fatherObj = fathernode;
    }
    if (data.mother) {
      const mothernode: any = myDiagram.model.findNodeDataForKey(data.mother);
      data.motherObj = mothernode;
    }

    ModalUtility.setDataDetail(data);
    ModalUtility.setDetail();
    ModalUtility.setTitle(this.getNameBorn(data));
  }

  static contentSave(data: FamilyModel) {
    ModalUtility.showSave();
    ModalUtility.hideUpdate();

    ModalUtility.setDataSave(data);
    ModalUtility.setSave();
    ModalUtility.setTitle('Nuovo Task');
  }

  static contentUpdate(data: FamilyModel) {
    ModalUtility.hideSave();
    ModalUtility.showUpdate();

    ModalUtility.setDataUpdate(data);
    ModalUtility.setUpdate();
    ModalUtility.setTitle('Modifica ' + this.getNameBorn(data));
  }

  // ------------- UTILITY DATA

  static makeLinks(data: FamilyModel[]): any[] {
    const links: any[] = [];
    data.forEach((el) => {
      if (el.mother) {
        links.push({
          key: el.key + '_' + el.mother,
          from: el.mother,
          to: el.key,
          color: this.femaleColor,
        });
      }
      if (el.father) {
        links.push({
          key: el.key + '_' + el.father,
          from: el.father,
          to: el.key,
          color: this.maleColor,
        });
      }
    });

    return links;
  }

  static getNameBorn(person: FamilyModel): string {
    return person.name + ' (' + person.birthDate?.getFullYear() + ')';
  }

  static searchBrothers(
    person: FamilyModel,
    data: FamilyModel[]
  ): FamilyModel[] {
    const brothers: FamilyModel[] = [];

    data.forEach((el) => {
      if (
        el.key !== person.key &&
        ((el.mother && el.mother === person.mother) ||
          (el.father && el.father === person.father))
      ) {
        brothers.push(el);
      }
    });

    return brothers;
  }

  static searchChildrens(
    person: FamilyModel,
    data: FamilyModel[]
  ): FamilyModel[] {
    const childrens: FamilyModel[] = [];

    data.forEach((el) => {
      if (
        el.key !== person.key &&
        ((el.mother && el.mother === person.key) ||
          (el.father && el.father === person.key))
      ) {
        childrens.push(el);
      }
    });

    return childrens;
  }

  static searchSpouse(
    person: FamilyModel,
    data: FamilyModel[]
  ): FamilyModel | undefined {
    const childrens: FamilyModel[] = this.searchChildrens(person, data);

    if (childrens && childrens.length && childrens[0]) {
      return person.gender === 'M'
        ? data.find((el) => el.key === childrens[0].mother)
        : data.find((el) => el.key === childrens[0].father);
    }

    return undefined;
  }
}
