import * as go from 'gojs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { OrgTreeTemplate } from '../../builder/org-tree/org-tree.template';
import { OrgModel } from '../../model/org.model';
import { ObjStateModel } from '../../../shared/model/obj-state.model';

@Component({
  selector: 'app-org-tree',
  templateUrl: './org-tree.component.html',
  styleUrls: ['./org-tree.component.scss'],
})
export class OrgTreeComponent extends DiagramBaseComponent<OrgModel> {
  // form
  listParents: OrgModel[] = [];
  @ViewChild('inputName') inputName: ElementRef<any>;
  @ViewChild('inputMatricola') inputMatricola: ElementRef<any>;
  @ViewChild('inputRole') inputRole: ElementRef<any>;
  @ViewChild('inputPic') inputPic: ElementRef<any>;
  @ViewChild('selectParent') selectParent: ElementRef<any>;
  @ViewChild('inputSkill') inputSkill: ElementRef<any>;
  skills: string[] = [];

  constructor() {
    super();
  }

  override ngAfterViewInit(): void {
    setTimeout(() => {
      const myModel = this.getModel();
      this.diagram = OrgTreeTemplate.make(this.divId, this.diagramProperties);
      this.diagram.model = myModel;
    }, 1000);
  }

  override afterModel(state: ObjStateModel): void {
    this.listParents = state.diagramNodeData as OrgModel[];
  }

  override getModel(): go.GraphLinksModel {
    return this.defaultModel();
  }

  override keepDataDetailFromEvent(data: OrgModel): void {}
  override keepDataUpdateFromEvent(data: OrgModel): void {
    if (data && data.name && this.inputName) {
      this.inputName.nativeElement.value = data.name;
    }
    if (data && data.matricola && this.inputMatricola) {
      this.inputMatricola.nativeElement.value = data.matricola;
    }
    if (data && data.role && this.inputRole) {
      this.inputRole.nativeElement.value = data.role;
    }
    if (data && data.parent && this.selectParent) {
      this.selectParent.nativeElement.value = data.parent;
    }
    if (this.dataUpdateFromEvent && this.dataUpdateFromEvent.skills) {
      this.skills = this.dataUpdateFromEvent.skills;
    } else {
      this.skills.length = 0;
    }
  }
  override keepDataSaveFromEvent(data: OrgModel): void {
    if (data && data.key && this.selectParent) {
      this.selectParent.nativeElement.value = data.key;
    }
    this.inputName.nativeElement.value = '';
    this.inputMatricola.nativeElement.value = '';
    this.inputRole.nativeElement.value = '';
    this.skills.length = 0;
  }

  override validateForm(): void {
    if (!this.inputName.nativeElement.value) {
      this.setMessage('Il nome è obbligatorio');
    }
    if (!this.inputRole.nativeElement.value) {
      this.setMessage('Il ruolo è obbligatorio');
    }
  }

  override saveModel(): void {
    const modelSave: OrgModel = this.getModelByForm();
    let linkToSave: any;
    if (modelSave.parent) {
      modelSave.key = Math.random();
      linkToSave = {
        from: modelSave.parent,
        to: modelSave.key,
      };
    }
    this.saveModelCommit(modelSave, linkToSave);
  }

  override updateModel(): void {
    const modelSave: OrgModel = this.getModelByForm();
    modelSave.key = this.dataUpdateFromEvent.key;
    let linkToSave;
    if (modelSave.parent && !this.dataUpdateFromEvent.parent) {
      linkToSave = {
        key: Math.random(),
        from: modelSave.parent,
        to: modelSave.key,
      };
    } else if (
      modelSave.parent &&
      this.dataUpdateFromEvent.parent &&
      modelSave.parent !== this.dataUpdateFromEvent.parent
    ) {
      this.updateLink(modelSave);
    } else if (!modelSave.parent) {
      this.removeLink(modelSave);
    }
    this.updateModelCommit(modelSave, linkToSave);
  }

  override getModelByForm(): OrgModel {
    return {
      key: undefined,
      name: this.inputName.nativeElement.value,
      matricola: this.inputMatricola.nativeElement.value,
      role: this.inputRole.nativeElement.value,
      parent: this.selectParent.nativeElement.value,
      pic: 'user.png',
      skills: this.skills,
    };
  }

  // ------------- FORM
  isDisabledParent(parent: OrgModel) {
    let modelCheck: OrgModel | undefined;
    if (this.typeOperation === 'UPDATE') {
      modelCheck = this.dataUpdateFromEvent;
    } else if (this.typeOperation === 'SAVE') {
      modelCheck = this.dataSaveFromEvent;
    }

    return !modelCheck || modelCheck.key === parent.key;
  }

  addSkill() {
    if (this.inputSkill.nativeElement.value) {
      this.skills.push(this.inputSkill.nativeElement.value);
    }
  }

  removeSkill(text: string) {
    const index = this.skills.findIndex((el) => el === text);
    if (index !== -1) {
      this.skills.splice(index, 1);
    }
  }

  // ------------- SAVE
  updateLink(person: OrgModel) {
    const link = this.state.diagramLinkData?.find((el) => el.to === person.key);
    if (link) {
      this.diagram.model.commit((m: any) => {
        m.setDataProperty(link, 'from', person.parent);
      });
    }
  }
  removeLink(person: OrgModel) {
    const link = this.state.diagramLinkData?.find((el) => el.to === person.key);

    this.diagram.model.commit((m: any) => {
      m.removeLinkData(link);
    });
  }
}
