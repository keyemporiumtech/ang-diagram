import { ShapeModel } from '../../../model/shape.model';

export interface KanbanProperties {
  noteColors?: string[];
  shapeGroup?: ShapeModel;
  shapeNode?: ShapeModel;
  textStatusSTOP?: { color?: string; text?: string };
  textStatusPROGRESS?: { color?: string; text?: string };
  textStatusCOMPLETE?: { color?: string; text?: string };
}
