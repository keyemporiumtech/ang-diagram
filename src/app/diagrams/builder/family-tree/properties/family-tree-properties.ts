import { EnumFigureType } from '../../../../shared/enum/figure-type.enum';

export interface FamilyTreeProperties {
  maleColor?: string;
  femaleColor?: string;
  typeShape?: EnumFigureType;
  textMales?: string;
  textFemales?: string;
}
