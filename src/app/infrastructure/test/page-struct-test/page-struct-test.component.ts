import * as go from 'gojs';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ObjDiagramModel } from '../../../shared/model/obj-diagram.model';
import { StructBuilder } from '../../builder/struct.builder';
import { StateNodeModel } from '../../../shared/model/state-node.model';
import { StateLinkModel } from '../../../shared/model/state-link.model';
import { ObjDiagramComponent } from '../../../shared/components/obj-diagram/obj-diagram.component';
import { EnumNodeTemplate } from '../../../shared/enum/node-template.enum';

@Component({
  selector: 'app-page-struct-test',
  templateUrl: './page-struct-test.component.html',
  styleUrls: ['./page-struct-test.component.scss'],
})
export class PageStructTestComponent implements AfterViewInit {
  @ViewChild('cmpObjDiagram') cmpObjDiagram: ObjDiagramComponent;
  objModel: ObjDiagramModel | undefined;

  constructor() {
    this.init();
    this.maker();
  }

  init() {
    this.objModel = StructBuilder.makeDiagramModel();
  }

  maker() {
    // data
    const listData: StateNodeModel[] = [];
    listData.push(
      StructBuilder.makeNodeGroup('client', 'lightgreen', 'Client')
    );
    listData.push(
      StructBuilder.putInGroup(
        StructBuilder.makeNodeData(
          'fe',
          'lightgray',
          'Frontend Angular',
          undefined,
          undefined,
          undefined,
          undefined,
          { source: 'assets/images/angular.png', width: 50, height: 50 }
        ),
        'client'
      )
    );
    listData.push(
      StructBuilder.makeNodeGroup('business', 'lightgreen', 'Business')
    );
    listData.push(
      StructBuilder.putInGroup(
        StructBuilder.makeNodeData('api', 'lightgray', 'Api Gateway'),
        'business'
      )
    );
    listData.push(
      StructBuilder.putInGroup(
        StructBuilder.makeNodeData('be', 'lightgray', 'Backend Java'),
        'business'
      )
    );
    listData.push(
      StructBuilder.makeNodeGroup('persistence', 'lightgreen', 'Persistence')
    );

    listData.push(
      StructBuilder.putInGroup(
        StructBuilder.makeNodeData('db', 'lightgray', 'Database'),
        'persistence'
      )
    );

    this.objModel?.state?.diagramNodeData?.push(...listData);

    // link
    const listLink: StateLinkModel[] = [];

    listLink.push(
      ...StructBuilder.linkBidirectional('client', 'business', 'RL')
    );
    listLink.push(StructBuilder.link('be', 'api', 'L', 'R'));
    listLink.push(
      ...StructBuilder.linkBidirectional('business', 'persistence', 'RL')
    );

    listLink.push(
      StructBuilder.link('db', 'be', 'B', 'B', 'call', 'orange', 2, 'orange')
    );
    listLink.push(
      StructBuilder.link('api', 'fe', 'T', 'T', 'call', 'orange', 2, 'orange')
    );

    this.objModel?.state?.diagramLinkData?.push(...listLink);
  }

  ngAfterViewInit(): void {
    if (
      this.cmpObjDiagram &&
      this.cmpObjDiagram.myDiagramComponent &&
      this.cmpObjDiagram.myDiagramComponent.diagram
    ) {
      this.cmpObjDiagram.myDiagramComponent.diagram.nodeTemplate =
        StructBuilder.makeDiagramNodeTemplate(
          this.cmpObjDiagram.nodeOrientation,
          EnumNodeTemplate.WITH_IMAGE
        );
    }
  }
}
