import { Component } from '@angular/core';
import { ObjDiagramModel } from './shared/model/obj-diagram.model';
import { DiagramExampleBuilder } from './shared/builder/diagram-examples.builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ang-diagram';
  objModel: ObjDiagramModel | undefined;

  constructor() {
    // this.objModel = DiagramExampleBuilder.getExample1();
    // this.objModel = DiagramBuilder.getExampleGroup1();
    // this.objModel = DiagramExampleBuilder.getGraph1();
    this.objModel = DiagramExampleBuilder.getGraph2();
  }
}
