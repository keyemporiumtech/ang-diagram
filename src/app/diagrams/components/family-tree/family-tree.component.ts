/** #see https://gojs.net/latest/samples/familyTree.html */
import * as go from 'gojs';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { FamilyModel } from '../../model/family.model';
import { DiagramBuilder } from '../../../shared/builder/diagram.builder';
import { FamilyTreeTemplate } from '../../builder/family-tree/family-tree.template';

@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
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
