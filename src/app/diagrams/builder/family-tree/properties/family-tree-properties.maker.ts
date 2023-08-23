import { FamilyTreeUtility } from '../utility/family-tree.utility';
import { FamilyTreeProperties } from './family-tree-properties';

export class FamilyTreePropertiesMaker {
  static setValues(properties?: FamilyTreeProperties) {
    if (properties) {
      if (properties.maleColor) {
        FamilyTreeUtility.maleColor = properties.maleColor;
      }
      if (properties.femaleColor) {
        FamilyTreeUtility.femaleColor = properties.femaleColor;
      }
      if (properties.typeShape) {
        FamilyTreeUtility.typeShape = properties.typeShape;
      }
      if (properties.textMales) {
        FamilyTreeUtility.textMales = properties.textMales;
      }
      if (properties.textFemales) {
        FamilyTreeUtility.textFemales = properties.textFemales;
      }
    }
  }
}
