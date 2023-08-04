import * as go from 'gojs';
import produce from 'immer';
import {
  AfterViewInit,
  Directive,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ObjStateModel } from '../../shared/model/obj-state.model';
import { ObjDiagramModel } from '../../shared/model/obj-diagram.model';
import { SharedModalComponent } from '../components/shared-modal/shared-modal.component';

@Directive()
export abstract class DiagramBaseComponent implements OnInit, AfterViewInit {
  // --------------- MANAGE DIAGRAM
  private _diagramModel: ObjDiagramModel;
  @Input() set diagramModel(val: ObjDiagramModel) {
    this._diagramModel = val;
    this.setModel(val);
  }
  get diagramModel(): ObjDiagramModel {
    return this._diagramModel;
  }
  @Input() diagramProperties: any;
  @Input() divId: string = '';

  title: string = '';
  state: ObjStateModel;
  diagram: go.Diagram;

  // ------------------- MANAGE MODAL BUTTONS
  @ViewChild('modalShared') modalShared: SharedModalComponent;
  dataDetailFromEvent: any;
  dataUpdateFromEvent: any;

  ngAfterViewInit(): void {}
  ngOnInit(): void {}

  setModel(diagramModel: ObjDiagramModel) {
    if (diagramModel) {
      this.state = diagramModel.state;
      this.title = diagramModel.title;
      this.divId = diagramModel.divId;
    }
  }

  /**
   * Torna il modello con i nodeDataArray e i nodeLinkArray di input
   * go.GraphLinksModel or go.TreeModel
   */
  abstract getModel(): any;
  /**
   * chiamata che intercetta il dato sul nodo di template cliccato
   * per il dettaglio e il salvataggio in modale (MODALE)
   * @param data Oggetto del nodo cliccato
   */
  abstract keepDataDetailFromEvent(data: any): void;
  /**
   * chiamata che intercetta il dato sul nodo di template cliccato
   * per l'update (MODALE)
   * @param data Oggetto del nodo cliccato
   */
  abstract keepDataUpdateFromEvent(data: any): void;
  /**
   * chiamato al click del salvataggio
   */
  abstract saveModel(): void;
  /**
   * chiamato al click dell'update
   */
  abstract updateModel(): void;
  /**
   * Ritorna il modello del nodo preso dal form interno del template passato a sharedModel
   * da usare nei metodi saveModel() e updateModel()
   */
  abstract getModelByForm(): any;

  dataDetailChanged(data: any) {
    this.dataDetailFromEvent = data;
    this.keepDataDetailFromEvent(data);
  }
  dataUpdateChanged(data: any) {
    this.dataUpdateFromEvent = data;
    this.keepDataUpdateFromEvent(data);
  }
  saveClick($event: any) {
    if (this.modalShared) {
      this.saveModel();
    }
  }
  updateClick($event: any) {
    if (this.modalShared) {
      this.updateModel();
    }
  }

  // -------------- manage json

  getJson(): ObjStateModel {
    return this.diagramModel.state;
  }

  getJsonString(): string {
    return JSON.stringify(this.getJson(), null, 4);
  }

  loadJson(state: ObjStateModel, diagram?: go.Diagram): void {
    if (!diagram) {
      diagram = this.diagram;
    }
    this.diagramModel.state = state;
    const model = this.getModel();
    diagram.model = model;
  }

  // -------------- download
  makeBlobCallback(blob: any, filename: string | undefined) {
    if (!filename) {
      filename = 'Graph.png';
    }
    var url = window.URL.createObjectURL(blob);

    const a: any = document.createElement('a');
    a.style = 'display: none';
    a.href = url;
    a.download = filename;

    // IE 11
    /*
    if (window.navigator['msSaveBlob'] !== undefined) {
      window.navigatormsSaveBlob(blob, filename);
      return;
    }
    */

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  download(filename?: string) {
    if (!filename && this.diagramModel && this.diagramModel.filename) {
      filename = this.diagramModel.filename;
    }
    var blob = this.diagram.makeImageData({
      background: 'white',
      returnType: 'blob',
      callback: (val) => this.makeBlobCallback(val, filename),
    });
  }

  // -------------- utility
  defaultModel(): go.GraphLinksModel {
    return new go.GraphLinksModel({
      modelData: this.diagramModel.state.diagramModelData,
      nodeDataArray: this.diagramModel.state.diagramNodeData,
      linkDataArray: this.diagramModel.state.diagramLinkData,
    });
  }

  saveModelCommit(model: any, link?: any, diagram?: go.Diagram) {
    if (!diagram) {
      diagram = this.diagram;
    }
    diagram.model.commit((m: any) => {
      m.addNodeData(model);
      if (link) {
        m.addLinkData(link);
      }
      diagram?.select(diagram.findNodeForData(model));
    });
  }

  updateModelCommit(model: any, link?: any, diagram?: go.Diagram) {
    if (!diagram) {
      diagram = this.diagram;
    }
    diagram.model.commit((m: any) => {
      const nodeModel = m.findNodeDataForKey(model.key);
      m.assignAllDataProperties(nodeModel, model);
      if (link) {
        const nodeLink = m.findLinkDataForKey(link.key);
        m.assignAllDataProperties(nodeLink, link);
      }
      diagram?.select(diagram.findNodeForData(model));
    });
  }
}
