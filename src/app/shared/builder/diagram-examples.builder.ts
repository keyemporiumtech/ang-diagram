import * as go from 'gojs';
import { EnumFigureType } from '../enum/figure-type.enum';
import { ObjDiagramModel } from '../model/obj-diagram.model';

export class DiagramExampleBuilder {
  static getExample1(): ObjDiagramModel {
    const model = new ObjDiagramModel();
    model.title = 'Go Js Angular';
    model.flgInfo = true;
    model.flgInspector = true;
    model.flgOverview = true;
    model.flgPalette = true;

    model.state = {
      // Diagram state props
      diagramNodeData: [
        {
          key: 'Alpha',
          text: 'Alpha',
          background: 'lightblue',
          type: EnumFigureType.ARROTONDATO,
        },
        { key: 'Beta', text: 'Beta', background: 'orange' },
        { key: 'Gamma', text: 'Gamma', background: 'lightgreen' },
        { key: 'Delta', text: 'Delta', background: 'pink' },
      ],
      diagramLinkData: [
        { from: 'Alpha', to: 'Beta' },
        { from: 'Alpha', to: 'Gamma' },
        { from: 'Beta', to: 'Beta' },
        { from: 'Gamma', to: 'Delta' },
        { from: 'Delta', to: 'Alpha' },
      ],
      diagramModelData: { prop: 'value' },
      skipsDiagramUpdate: false,
      selectedNodeData: null, // used by InspectorComponent

      // Palette state props
      paletteNodeData: [
        { key: 'Epsilon', text: 'Epsilon', color: 'red' },
        { key: 'Kappa', text: 'Kappa', color: 'purple' },
      ],
      paletteModelData: { prop: 'val' },
    };
    return model;
  }

  static getExampleGroup1(): ObjDiagramModel {
    const model = new ObjDiagramModel();
    model.title = 'Go Js Angular - Groups';
    model.flgInfo = true;
    model.flgInspector = true;
    model.flgOverview = true;
    model.flgPalette = true;

    model.state = {
      // Diagram state props
      diagramNodeData: [
        { id: 'client', text: 'Client', color: 'lightgreen', isGroup: true },
        { id: 'fe', text: 'app', color: 'orange', group: 'client' },
        { id: 'business', text: 'Business', color: 'lightblue', isGroup: true },
        { id: 'api', text: 'Api Gateway', color: 'pink', group: 'business' },
        { id: 'be', text: 'Backend', color: 'orange', group: 'business' },
        {
          id: 'persistence',
          text: 'Persistence',
          color: 'lightgray',
          isGroup: true,
        },
        { id: 'db', text: 'Database', color: 'yellow', group: 'persistence' },
      ],
      diagramLinkData: [
        { key: -1, from: 'client', to: 'business' },
        { key: -2, from: 'business', to: 'client' },
        { key: -3, from: 'business', to: 'persistence' },
        { key: -4, from: 'persistence', to: 'business' },
        { key: -5, from: 'be', to: 'api' },
      ],
      diagramModelData: { prop: 'value' },
      skipsDiagramUpdate: false,
      selectedNodeData: null, // used by InspectorComponent

      // Palette state props
      paletteNodeData: [
        { key: 'Epsilon', text: 'Epsilon', color: 'red' },
        { key: 'Kappa', text: 'Kappa', color: 'purple' },
      ],
      paletteModelData: { prop: 'val' },
    };
    return model;
  }

  static getGraph1(): ObjDiagramModel {
    const model = new ObjDiagramModel();
    model.title = 'Go Js Angular';
    model.flgInfo = false;
    model.flgInspector = false;
    model.flgOverview = true;
    model.flgPalette = false;

    model.state = {
      // Diagram state props
      diagramNodeData: [
        {
          key: 'Alpha',
          text: 'Alpha',
          background: 'lightblue',
          type: EnumFigureType.ARROTONDATO,
        },
        { key: 'Beta', text: 'Beta', background: 'orange' },
        { key: 'Gamma', text: 'Gamma', background: 'lightgreen' },
        { key: 'Delta', text: 'Delta', background: 'pink' },
      ],
      diagramLinkData: [
        {
          from: 'Alpha',
          to: 'Beta',
          curve: go.Link.JumpGap,
          routing: go.Link.Orthogonal,
        },
        {
          from: 'Alpha',
          to: 'Gamma',
          curve: go.Link.JumpGap,
          routing: go.Link.Orthogonal,
        },
        {
          from: 'Beta',
          to: 'Beta',
          curve: go.Link.Bezier,
          routing: go.Link.Orthogonal,
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Bottom,
          text: 'For me',
          color: 'red',
          size: 2.5,
        },
        {
          from: 'Gamma',
          to: 'Delta',
          curve: go.Link.JumpGap,
          routing: go.Link.Orthogonal,
        },
        {
          from: 'Delta',
          to: 'Alpha',
          curve: go.Link.JumpGap,
          routing: go.Link.Orthogonal,
        },
      ],
    };
    return model;
  }

  static getGraph2(): ObjDiagramModel {
    const model = new ObjDiagramModel();
    model.title = 'Go Js Angular';
    model.flgInfo = false;
    model.flgInspector = false;
    model.flgOverview = true;
    model.flgPalette = false;
    model.orientation = 'Horizontal';

    model.state = {
      // Diagram state props
      diagramNodeData: [
        {
          key: 'client',
          text: 'Client',
          background: 'lightgreen',
          isGroup: true,
        },
        {
          key: 'fe',
          text: 'app',
          background: 'orange',
          group: 'client',
          textAlign: 'centered',
          margin: new go.Margin(20, 20, 20, 20),
          textMargin: new go.Margin(20, 20, 20, 20),
        },
        {
          key: 'business',
          text: 'Business',
          background: 'lightblue',
          isGroup: true,
        },
        { key: 'be', text: 'Backend', background: 'orange', group: 'business' },
        {
          key: 'api',
          text: 'Api Gateway',
          background: 'pink',
          group: 'business',
        },
        {
          key: 'persistence',
          text: 'Persistence',
          background: 'lightgray',
          isGroup: true,
        },
        {
          key: 'db',
          text: 'Database',
          background: 'yellow',
          group: 'persistence',
        },
      ],
      diagramLinkData: [
        {
          key: -1,
          from: 'client',
          to: 'business',
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          key: -2,
          from: 'business',
          to: 'client',
          fromSpot: go.Spot.Left,
          toSpot: go.Spot.Right,
        },
        {
          key: -3,
          from: 'business',
          to: 'persistence',
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          key: -4,
          from: 'persistence',
          to: 'business',
          fromSpot: go.Spot.Left,
          toSpot: go.Spot.Right,
        },
        {
          key: -5,
          from: 'be',
          to: 'api',
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
      ],
    };
    return model;
  }
}
