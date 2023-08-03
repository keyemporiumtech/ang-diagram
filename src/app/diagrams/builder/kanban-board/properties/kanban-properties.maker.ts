import { ShapeModel } from '../../../model/shape.model';
import { KanbanUtility } from '../utility/kanban.utility';
import { KanbanProperties } from './kanban.properties';

export class KanbanPropertiesMaker {
  static setValues(properties?: KanbanProperties) {
    if (properties && properties.noteColors) {
      KanbanUtility.noteColors = properties.noteColors;
    }
    if (properties && properties.shapeGroup) {
      this.putShapeGroup(properties.shapeGroup);
    }
    if (properties && properties.shapeNode) {
      this.putShapeNode(properties.shapeNode);
    }
    if (properties && properties.textStatusSTOP) {
      this.putTextSTOP(properties.textStatusSTOP);
    }
    if (properties && properties.textStatusPROGRESS) {
      this.putTextPROGRESS(properties.textStatusPROGRESS);
    }
    if (properties && properties.textStatusCOMPLETE) {
      this.putTextCOMPLETE(properties.textStatusCOMPLETE);
    }
  }

  static putShapeGroup(shape?: ShapeModel) {
    if (shape) {
      if (shape.type) {
        KanbanUtility.shapeGroup.type = shape.type;
      }
      if (shape.background) {
        KanbanUtility.shapeGroup.background = shape.background;
      }
      if (shape.borderColor) {
        KanbanUtility.shapeGroup.borderColor = shape.borderColor;
      }
      if (shape.borderSize) {
        KanbanUtility.shapeGroup.borderSize = shape.borderSize;
      }
    }
  }

  static putShapeNode(shape?: ShapeModel) {
    if (shape) {
      if (shape.type) {
        KanbanUtility.shapeNode.type = shape.type;
      }
      if (shape.background) {
        KanbanUtility.shapeNode.background = shape.background;
      }
      if (shape.borderColor) {
        KanbanUtility.shapeNode.borderColor = shape.borderColor;
      }
      if (shape.borderSize) {
        KanbanUtility.shapeNode.borderSize = shape.borderSize;
      }
    }
  }

  static putTextSTOP(text?: { color?: string; text?: string }) {
    if (text) {
      if (text.color) {
        KanbanUtility.textStatusSTOP.color = text.color;
        KanbanUtility.noteColors[1] = text.color;
      }
      if (text.text) {
        KanbanUtility.textStatusSTOP.text = text.text;
      }
    }
  }

  static putTextPROGRESS(text?: { color?: string; text?: string }) {
    if (text) {
      if (text.color) {
        KanbanUtility.textStatusPROGRESS.color = text.color;
        KanbanUtility.noteColors[2] = text.color;
      }
      if (text.text) {
        KanbanUtility.textStatusPROGRESS.text = text.text;
      }
    }
  }

  static putTextCOMPLETE(text?: { color?: string; text?: string }) {
    if (text) {
      if (text.color) {
        KanbanUtility.textStatusCOMPLETE.color = text.color;
        KanbanUtility.noteColors[3] = text.color;
      }
      if (text.text) {
        KanbanUtility.textStatusCOMPLETE.text = text.text;
      }
    }
  }
}
