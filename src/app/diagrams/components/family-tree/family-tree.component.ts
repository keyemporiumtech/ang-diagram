/** #see https://gojs.net/latest/samples/familyTree.html */
import * as go from 'gojs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { FamilyTreeTemplate } from '../../builder/family-tree/family-tree.template';
import { FamilyModel } from '../../model/family.model';
import { FamilyTreeUtility } from '../../builder/family-tree/utility/family-tree.utility';
import { ObjStateModel } from '../../../shared/model/obj-state.model';

@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.scss'],
})
export class FamilyTreeComponent extends DiagramBaseComponent<FamilyModel> {
  message: string | undefined;
  brothers: FamilyModel[] = [];
  flgBrothers: boolean;
  childrens: FamilyModel[] = [];
  flgChildrens: boolean;
  spouse: FamilyModel | undefined;
  flgSpouse: boolean;
  // form
  listFathers: FamilyModel[] = [];
  listMothers: FamilyModel[] = [];
  @ViewChild('inputName') inputName: ElementRef<any>;
  @ViewChild('selectGender') selectGender: ElementRef<any>;
  @ViewChild('inputBirthday') inputBirthday: ElementRef<any>;
  @ViewChild('inputDeathday') inputDeathday: ElementRef<any>;
  @ViewChild('selectFather') selectFather: ElementRef<any>;
  @ViewChild('selectMother') selectMother: ElementRef<any>;

  constructor() {
    super();
  }

  override ngAfterViewInit(): void {
    setTimeout(() => {
      const myModel = this.getModel();
      this.diagram = FamilyTreeTemplate.make(
        this.divId,
        this.diagramProperties
      );
      this.diagram.model = myModel;
    }, 1000);
  }

  override afterModel(state: ObjStateModel): void {
    this.listFathers = (state.diagramNodeData as FamilyModel[]).filter(
      (el) => el.gender === 'M'
    );
    this.listMothers = (state.diagramNodeData as FamilyModel[]).filter(
      (el) => el.gender === 'F'
    );
  }

  override getModel(): go.GraphLinksModel {
    return this.defaultModel();
  }

  override keepDataDetailFromEvent(data: FamilyModel): void {}
  override keepDataUpdateFromEvent(data: FamilyModel): void {
    if (data && data.name && this.inputName) {
      this.inputName.nativeElement.value = data.name;
    }

    if (data && data.gender && this.selectGender) {
      this.selectGender.nativeElement.value = data.gender;
    }

    if (data && data.birthDate && this.inputBirthday) {
      this.inputBirthday.nativeElement.value = this.formatDate(data.birthDate);
    }

    if (data && data.deathDate && this.inputDeathday) {
      this.inputDeathday.nativeElement.value = this.formatDate(data.deathDate);
    }

    if (data && data.father && this.selectFather) {
      this.selectFather.nativeElement.value = data.father;
    }
    if (data && data.mother && this.selectMother) {
      this.selectMother.nativeElement.value = data.mother;
    }
  }
  override keepDataSaveFromEvent(data: FamilyModel): void {}
  override saveModel(): void {
    this.checkMessage();
    if (!this.message) {
    }
  }
  override updateModel(): void {
    this.checkMessage();
    if (!this.message) {
      const modelSave: FamilyModel = this.getModelByForm();
      modelSave.key = this.dataUpdateFromEvent.key;
      this.updateAllLink(modelSave);
      modelSave.key = this.dataUpdateFromEvent.key;
      this.updateModelCommit(modelSave);
    }
  }
  override getModelByForm(): FamilyModel {
    return {
      key: undefined,
      father: this.selectFather.nativeElement.value,
      mother: this.selectMother.nativeElement.value,
      name: this.inputName.nativeElement.value,
      gender: this.selectGender.nativeElement.value,
      birthDate: this.inputBirthday.nativeElement.value
        ? new Date(this.inputBirthday.nativeElement.value)
        : undefined,
      deathDate: this.inputDeathday.nativeElement.value
        ? new Date(this.inputDeathday.nativeElement.value)
        : undefined,
    };
  }

  // ------------- FORM
  checkMessage(): void {
    this.message = undefined;
    if (
      !this.selectFather.nativeElement.value &&
      !this.selectMother.nativeElement.value
    ) {
      this.message =
        'Non è possibile salvare un componente senza inserire almeno un genitore';
    }
  }
  isDisabledParent(parent: FamilyModel) {
    if (this.typeOperation === 'UPDATE') {
      const dataScelta = new Date(this.inputBirthday.nativeElement.value);
      const cond1 =
        this.dataUpdateFromEvent && this.dataUpdateFromEvent.key === parent.key;
      const cond2 =
        dataScelta &&
        parent.birthDate &&
        dataScelta.getFullYear() <= parent.birthDate.getFullYear();
      return cond1 || cond2;
    } else if (this.typeOperation === 'SAVE') {
      const dataScelta = new Date(this.inputBirthday.nativeElement.value);
      return (
        dataScelta &&
        dataScelta.getFullYear() <= (parent.birthDate as any).getFullYear()
      );
    } else {
      return false;
    }
  }

  changeBirthday() {
    const dataScelta = new Date(this.inputBirthday.nativeElement.value);
    const fatherKey = this.selectFather.nativeElement.value;
    const motherKey = this.selectMother.nativeElement.value;
    let father: FamilyModel, mother: FamilyModel;
    if (fatherKey) {
      father = this.diagramModel.state.diagramNodeData?.find(
        (el) => el.key === fatherKey
      ) as FamilyModel;
      if (
        father &&
        father.birthDate &&
        dataScelta &&
        dataScelta.getFullYear() <= father.birthDate.getFullYear()
      ) {
        this.selectFather.nativeElement.value = '';
      }
    }
    if (motherKey) {
      mother = this.diagramModel.state.diagramNodeData?.find(
        (el) => el.key === motherKey
      ) as FamilyModel;
      if (
        mother &&
        mother.birthDate &&
        dataScelta &&
        mother.birthDate.getFullYear() <= dataScelta.getFullYear()
      ) {
        this.selectMother.nativeElement.value = '';
      }
    }
  }

  // ------------- ACCORDIONS
  clickSpouse(person: FamilyModel) {
    this.flgSpouse = !this.flgSpouse;
    if (this.flgSpouse) {
      this.spouse = FamilyTreeUtility.searchSpouse(
        person,
        this.diagramModel.state.diagramNodeData as any
      );
    } else {
      this.spouse = undefined;
    }
  }

  clickBrothers(person: FamilyModel) {
    this.flgBrothers = !this.flgBrothers;
    if (this.flgBrothers) {
      this.brothers = FamilyTreeUtility.searchBrothers(
        person,
        this.diagramModel.state.diagramNodeData as any
      );
    } else {
      this.brothers.length = 0;
    }
  }

  clickChildrens(person: FamilyModel) {
    this.flgChildrens = !this.flgChildrens;
    if (this.flgChildrens) {
      this.childrens = FamilyTreeUtility.searchChildrens(
        person,
        this.diagramModel.state.diagramNodeData as any
      );
    } else {
      this.childrens.length = 0;
    }
  }

  // ------------- SAVE
  updateAllLink(person: FamilyModel) {
    let linkFather: any, linkMother: any;
    if (person.father) {
      const father = this.diagramModel.state.diagramNodeData?.find(
        (el) => el.key === person.father
      ) as FamilyModel;
      linkFather = {
        key: person.key + '_' + father.key,
        from: father.key,
        to: person.key,
      };
    }
    if (person.mother) {
      const mother = this.diagramModel.state.diagramNodeData?.find(
        (el) => el.key === person.mother
      ) as FamilyModel;
      linkMother = {
        key: person.key + '_' + mother.key,
        from: mother.key,
        to: person.key,
      };
    }

    const links = this.state.diagramLinkData?.filter(
      (el) => el.to === person.key
    );

    this.diagram.model.commit((m: any) => {
      if (links && links.length) {
        links.forEach((link) => {
          m.removeLinkData(link);
        });
      }

      if (linkFather) {
        m.addLinkData(linkFather);
      }

      if (linkMother) {
        m.addLinkData(linkMother);
      }

      this.diagram?.select(this.diagram.findNodeForKey(person.key));
    });
  }

  // ------------- UTILITY
  getBrothers(person: FamilyModel) {
    return FamilyTreeUtility.searchBrothers(
      person,
      this.diagramModel.state.diagramNodeData as any
    );
  }

  getNameBorn(person: any): string {
    return FamilyTreeUtility.getNameBorn(person);
  }

  private formatDate(d: Date): string {
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
