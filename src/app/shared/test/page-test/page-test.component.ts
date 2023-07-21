import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ObjDiagramModel } from '../../model/obj-diagram.model';
import { DiagramExampleBuilder } from '../../builder/diagram-examples.builder';
import { DiagramBuilder } from '../../builder/diagram.builder';
import { ObjDiagramComponent } from '../../components/obj-diagram/obj-diagram.component';
import * as go from 'gojs';

@Component({
  selector: 'app-page-test',
  templateUrl: './page-test.component.html',
  styleUrls: ['./page-test.component.scss'],
})
export class PageTestComponent implements AfterViewInit {
  objModel: ObjDiagramModel | undefined;
  @ViewChild('cmpObjDiagram') cmpObjDiagram: ObjDiagramComponent;

  constructor() {
    // this.objModel = DiagramExampleBuilder.getExample1();
    // this.objModel = DiagramBuilder.getExampleGroup1();
    // this.objModel s= DiagramExampleBuilder.getGraph1();
    this.objModel = DiagramExampleBuilder.getGraph2();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.cmpObjDiagram) {
        this.initDiagram();
      }
    }, 200);
  }

  public initDiagram(): void {
    if (this.cmpObjDiagram && this.cmpObjDiagram.myDiagramComponent) {
      this.cmpObjDiagram.myDiagramComponent.diagram.add(
        new go.Part('Vertical', { locationObjectName: 'main' })
          .add(
            new go.Panel('Spot')
              .add(
                new go.Shape('Rectangle', {
                  name: 'main',
                  fill: 'lightgreen',
                  stroke: null,
                  width: 100,
                  height: 100,
                })
              )
              .add(
                new go.Shape('Rectangle', {
                  fill: 'lightcoral',
                  stroke: null,
                  width: 30,
                  height: 30,
                  alignment: go.Spot.TopRight,
                  alignmentFocus: go.Spot.TopRight,
                })
              )
          )
          .add(
            new go.TextBlock(
              'alignment: TopRight,\n alignmentFocus: TopRight',
              {
                font: '11px sans-serif',
              }
            )
          )
      );
    }
  }
}
