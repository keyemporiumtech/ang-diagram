import * as go from 'gojs';
import { Component } from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { KanbanBoardTemplate } from '../../builder/kanban-board/kanban-board.template';
import { KanbanModel } from '../../model/kanban.model';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent extends DiagramBaseComponent {
  constructor() {
    super();
  }

  override ngAfterViewInit(): void {
    setTimeout(() => {
      const myModel = this.getModel();
      this.diagram = KanbanBoardTemplate.make(
        this.divId,
        this.diagramProperties
      );
      this.diagram.model = myModel;
    }, 1000);
  }

  override getModel(): go.GraphLinksModel {
    return this.defaultModel();
  }

  override keepDataDetailFromEvent(data: KanbanModel): void {}
  override keepDataUpdateFromEvent(data: KanbanModel): void {}
  override saveModel(): void {}
  override updateModel(): void {}
  override getModelByForm(): void {}
}
