/** #see https://gojs.net/latest/samples/familyTree.html */
import * as go from 'gojs';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { FamilyTreeTemplate } from '../../builder/family-tree/family-tree.template';
import { ObjStateModel } from '../../../shared/model/obj-state.model';
import { DiagramAngBaseComponent } from '../../abstract/diagram-ang-base.component';
import { FamilyModel } from '../../model/family.model';

@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.scss'],
})
export class FamilyTreeComponent extends DiagramBaseComponent {
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

  override getModel(): go.GraphLinksModel {
    return this.defaultModel();
  }

  override keepDataDetailFromEvent(data: FamilyModel): void {}
  override keepDataUpdateFromEvent(data: FamilyModel): void {}
  override saveModel(): void {}
  override updateModel(): void {}
  override getModelByForm(): void {}
}
