/** #see https://gojs.net/latest/samples/familyTree.html */
import * as go from 'gojs';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { FamilyTreeTemplate } from '../../builder/family-tree/family-tree.template';
import { ObjStateModel } from '../../../shared/model/obj-state.model';

@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.scss'],
})
export class FamilyTreeComponent extends DiagramBaseComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override initializeDiagram() {
    return FamilyTreeTemplate.makeTemplate();
  }
}
