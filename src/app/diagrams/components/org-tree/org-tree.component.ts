import * as go from 'gojs';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { OrgTreeTemplate } from '../../builder/org-tree/org-tree.template';
import { ObjStateModel } from '../../../shared/model/obj-state.model';

@Component({
  selector: 'app-org-tree',
  templateUrl: './org-tree.component.html',
  styleUrls: ['./org-tree.component.scss'],
})
export class OrgTreeComponent extends DiagramBaseComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override initializeDiagram() {
    return OrgTreeTemplate.makeTemplate();
  }
}
