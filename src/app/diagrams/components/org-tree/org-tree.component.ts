import * as go from 'gojs';
import { Component } from '@angular/core';
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
  constructor() {
    super();
  }

  override afterModel(state: ObjStateModel): void {}

  override ngAfterViewInit(): void {
    setTimeout(() => {
      const myModel = this.getModel();
      this.diagram = OrgTreeTemplate.make(this.divId, this.diagramProperties);
      this.diagram.model = myModel;
    }, 1000);
  }

  override getModel(): go.GraphLinksModel {
    return this.defaultModel();
  }

  override keepDataDetailFromEvent(data: OrgModel): void {}
  override keepDataUpdateFromEvent(data: OrgModel): void {}
  override keepDataSaveFromEvent(data: OrgModel): void {}

  override saveModel(): void {}
  override updateModel(): void {}
  override getModelByForm(): OrgModel | undefined {
    return undefined;
  }
}
