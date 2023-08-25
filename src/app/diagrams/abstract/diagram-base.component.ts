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
import { StateNodeModel } from '../../shared/model/state-node.model';

@Directive()
export abstract class DiagramBaseComponent<T extends StateNodeModel>
  implements OnInit, AfterViewInit
{
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
  typeOperation: 'DETAIL' | 'UPDATE' | 'SAVE' | 'NONE' = 'NONE';
  @ViewChild('modalShared') modalShared: SharedModalComponent;
  dataDetailFromEvent: T;
  dataUpdateFromEvent: T;
  dataSaveFromEvent: T;
  dataDetail: T;
  dataUpdate: T;
  dataSave: T;

  ngAfterViewInit(): void {}
  ngOnInit(): void {}

  setModel(diagramModel: ObjDiagramModel) {
    if (diagramModel) {
      this.state = diagramModel.state;
      this.title = diagramModel.title;
      this.divId = diagramModel.divId;
      this.afterModel(this.state);
    }
  }

  /**
   * Operazioni da fare appena viene acquisito il modello.
   * In questo metodo è possibile modificare e arricchire i dati e i link di input
   * anche senza ridisegnare il grafo
   */
  abstract afterModel(state: ObjStateModel): void;
  /**
   * Torna il modello con i nodeDataArray e i nodeLinkArray di input
   * go.GraphLinksModel or go.TreeModel
   */
  abstract getModel(): any;
  /**
   * chiamata che intercetta il dato sul nodo di template cliccato
   * per il dettaglio (MODALE)
   * @param data Oggetto del nodo cliccato arricchito da afterModel
   */
  abstract keepDataDetailFromEvent(data: T): void;
  /**
   * chiamata che intercetta il dato sul nodo di template cliccato
   * per l'update (MODALE)
   * @param data Oggetto del nodo cliccato arricchito da afterModel
   */
  abstract keepDataUpdateFromEvent(data: T): void;
  /**
   * chiamata che intercetta il dato sul nodo di template cliccato
   * per il salva (MODALE)
   * @param data Oggetto del nodo cliccato arricchito da afterModel
   */
  abstract keepDataSaveFromEvent(data: T): void;
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
  abstract getModelByForm(): T | undefined;

  /**
   * Metodo che aggiunge messaggi di validazioni e può sfruttare il setMessage()
   */
  abstract validateForm(): void;

  dataDetailChanged(data: T) {
    this.dataDetailFromEvent = data;
    this.dataDetail = this.getDataModel(this.dataDetailFromEvent);
    this.typeOperation = 'DETAIL';
    this.keepDataDetailFromEvent(this.dataDetail);
  }
  dataUpdateChanged(data: T) {
    this.dataUpdateFromEvent = data;
    this.dataUpdate = this.getDataModel(this.dataUpdateFromEvent);
    this.typeOperation = 'UPDATE';
    this.keepDataUpdateFromEvent(this.dataUpdate);
  }
  dataSaveChanged(data: T) {
    this.dataSaveFromEvent = data;
    this.dataSave = this.getDataModel(this.dataSaveFromEvent);
    this.typeOperation = 'SAVE';
    this.keepDataSaveFromEvent(this.dataSave);
  }
  saveClick($event: any) {
    if (this.modalShared) {
      this.checkMessage();
      if (!this.hasMessage()) {
        this.saveModel();
      }
    }
  }
  updateClick($event: any) {
    if (this.modalShared) {
      this.checkMessage();
      if (!this.hasMessage()) {
        this.updateModel();
      }
    }
  }

  // -------------- manage validations
  checkMessage(): void {
    this.emptyMessages();
    this.validateForm();
  }

  setMessage(message: string): void {
    if (this.modalShared) {
      this.modalShared.setMessage(message);
    }
  }
  setMessages(messages: string[]): void {
    if (this.modalShared) {
      this.modalShared.setMessages(messages);
    }
  }
  emptyMessages() {
    if (this.modalShared) {
      this.modalShared.emptyMessages();
    }
  }

  hasMessage(): boolean {
    return this.modalShared ? this.modalShared.hasMessage() : false;
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

  // -------------- UTILS
  private getDataModel(dataFromEvent: T): any {
    if (
      dataFromEvent &&
      this.diagramModel &&
      this.diagramModel.state &&
      this.diagramModel.state.diagramNodeData
    ) {
      return this.diagramModel.state.diagramNodeData.find(
        (el) => el.key === dataFromEvent.key
      );
    }
    return undefined;
  }
}
