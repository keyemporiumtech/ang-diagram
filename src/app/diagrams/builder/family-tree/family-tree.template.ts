import * as go from 'gojs';
import { FamilyModel } from '../../model/family.model';
import { EnumFigureType } from '../../../shared/enum/figure-type.enum';
import { ObjStateModel } from '../../../shared/model/obj-state.model';

export class FamilyTreeTemplate {
  static maleColor: string = '#90CAF9';
  static femaleColor: string = '#F48FB1';
  static typeShape: EnumFigureType = EnumFigureType.RETTANGOLO;
  static textMales: string = 'Males';
  static textFemales: string = 'Females';

  static makeTemplate(properties?: FamilyTreeProperties) {
    // rewrite defaults
    FamilyTreeMaker.putValues(properties);

    const $ = go.GraphObject.make; // for conciseness in defining templates

    const myDiagram = $(go.Diagram, {
      'toolManager.hoverDelay': 100, // 100 milliseconds instead of the default 850
      allowCopy: false,
      // create a TreeLayout for the family tree
      layout: $(go.TreeLayout, {
        angle: 90,
        nodeSpacing: 10,
        layerSpacing: 40,
        layerStyle: go.TreeLayout.LayerUniform,
      }),
    });

    // Set up a Part as a legend, and place it directly on the diagram
    myDiagram.add(
      $(
        go.Part,
        'Table',
        { position: new go.Point(500, 10), selectable: false },
        $(go.TextBlock, 'Key', {
          row: 0,
          font: '700 14px Droid Serif, sans-serif',
        }), // end row 0
        $(
          go.Panel,
          'Horizontal',
          { row: 1, alignment: go.Spot.Left },
          $(go.Shape, this.typeShape, {
            desiredSize: new go.Size(30, 30),
            fill: this.maleColor,
            margin: 5,
          }),
          $(go.TextBlock, this.textMales, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ), // end row 1
        $(
          go.Panel,
          'Horizontal',
          { row: 2, alignment: go.Spot.Left },
          $(go.Shape, this.typeShape, {
            desiredSize: new go.Size(30, 30),
            fill: this.femaleColor,
            margin: 5,
          }),
          $(go.TextBlock, this.textFemales, {
            font: '700 13px Droid Serif, sans-serif',
          })
        ) // end row 2
      )
    );

    // define tooltips for nodes
    var tooltiptemplate = $(
      'ToolTip',
      { 'Border.fill': 'whitesmoke', 'Border.stroke': 'black' },
      $(
        go.TextBlock,
        {
          font: 'bold 8pt Helvetica, bold Arial, sans-serif',
          wrap: go.TextBlock.WrapFit,
          margin: 5,
        },
        new go.Binding('text', '', this.tooltipTextConverter)
      )
    );

    // replace the default Node template in the nodeTemplateMap
    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { deletable: false, toolTip: tooltiptemplate },
      new go.Binding('text', 'name'),
      $(
        go.Shape,
        this.typeShape,
        {
          fill: 'lightgray',
          stroke: null,
          strokeWidth: 0,
          stretch: go.GraphObject.Fill,
          alignment: go.Spot.Center,
        },
        new go.Binding('fill', 'gender', this.genderBrushConverter)
      ),
      $(
        go.TextBlock,
        {
          font: '700 12px Droid Serif, sans-serif',
          textAlign: 'center',
          margin: 10,
          maxSize: new go.Size(80, NaN),
        },
        new go.Binding('text', 'name')
      )
    );

    // define the Link template
    myDiagram.linkTemplate = $(
      go.Link, // the whole link panel
      { routing: go.Link.Orthogonal, corner: 5, selectable: false },
      $(go.Shape, { strokeWidth: 3, stroke: '#424242' }).bind(
        'stroke',
        'color'
      ),
      $(go.Shape, { toArrow: 'Standard', scale: 1.5 }),
      $(go.TextBlock, { margin: new go.Margin(5, 0, 0, 0) }).bind('text')
    );

    // create the model for the family tree
    // myDiagram.model = new go.TreeModel(nodeDataArray);
    myDiagram.model = new go.GraphLinksModel({
      nodeKeyProperty: 'key',
      linkToPortIdProperty: 'toPort',
      linkFromPortIdProperty: 'fromPort',
      linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksMode
      nodeDataArray: [this.sampleFamilyModel(0), this.sampleFamilyModel(1)],
      // linkDataArray: linkDataArray,
    });

    return myDiagram;
  }

  static reloadTemplate(data: ObjStateModel, diagram: go.Diagram) {
    diagram.model = new go.GraphLinksModel({
      nodeKeyProperty: 'key',
      linkToPortIdProperty: 'toPort',
      linkFromPortIdProperty: 'fromPort',
      linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksMode
      nodeDataArray: data.diagramNodeData,
      linkDataArray: data.diagramLinkData,
    });
  }

  static sampleFamilyModel(key: string | number, name?: string): FamilyModel {
    const obj: FamilyModel = {
      key: key,
      name: name ? name : 'EmptyName',
      gender: 'M',
      birthYear: '1981',
    };
    return obj;
  }

  // ------------- UTILS ------------------

  // get tooltip text from the object's data
  static tooltipTextConverter = (person: FamilyModel) => {
    var str = '';
    str += 'Born: ' + person.birthYear;
    if (person.deathYear !== undefined) str += '\nDied: ' + person.deathYear;
    return str;
  };

  // define Converters to be used for Bindings
  static genderBrushConverter = (gender: 'M' | 'F') => {
    if (gender === 'M') return this.maleColor;
    if (gender === 'F') return this.femaleColor;
    return 'orange';
  };
}

// ------------------ PROPERTIES
export interface FamilyTreeProperties {
  maleColor?: string;
  femaleColor?: string;
  typeShape?: EnumFigureType;
  textMales?: string;
  textFemales?: string;
}

// ------------------ MAKER
export class FamilyTreeMaker {
  static putValues(properties?: FamilyTreeProperties) {
    if (properties) {
      if (properties.maleColor) {
        FamilyTreeTemplate.maleColor = properties.maleColor;
      }
      if (properties.femaleColor) {
        FamilyTreeTemplate.femaleColor = properties.femaleColor;
      }
      if (properties.typeShape) {
        FamilyTreeTemplate.typeShape = properties.typeShape;
      }
      if (properties.textMales) {
        FamilyTreeTemplate.textMales = properties.textMales;
      }
      if (properties.textFemales) {
        FamilyTreeTemplate.textFemales = properties.textFemales;
      }
    }
  }
}
