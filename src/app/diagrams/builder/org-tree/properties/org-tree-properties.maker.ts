import { ShapeModel } from '../../../model/shape.model';
import { OrgTreeUtility } from '../utility/org-tree.utility';
import { OrgTreeProperties } from './org-tree.properties';

export class OrgTreePropertiesMaker {
  static setValues(properties?: OrgTreeProperties) {
    if (properties) {
      if (properties.levelColors) {
        OrgTreeUtility.levelColors = properties.levelColors;
      }
      if (properties.shape) {
        this.putShape(properties.shape);
      }
      if (properties.textAddEmploy) {
        OrgTreeUtility.textAddEmploy = properties.textAddEmploy;
      }
      if (properties.textVacatePosition) {
        OrgTreeUtility.textVacatePosition = properties.textVacatePosition;
      }
      if (properties.textRemoveRole) {
        OrgTreeUtility.textRemoveRole = properties.textRemoveRole;
      }
      if (properties.textRemoveDepartment) {
        OrgTreeUtility.textRemoveDepartment = properties.textRemoveDepartment;
      }
    }
  }
  static putShape(shape?: ShapeModel) {
    if (shape) {
      if (shape.type) {
        OrgTreeUtility.shape.type = shape.type;
      }
      if (shape.background) {
        OrgTreeUtility.shape.background = shape.background;
      }
      if (shape.borderColor) {
        OrgTreeUtility.shape.borderColor = shape.borderColor;
      }
      if (shape.borderSize) {
        OrgTreeUtility.shape.borderSize = shape.borderSize;
      }
    }
  }
}
