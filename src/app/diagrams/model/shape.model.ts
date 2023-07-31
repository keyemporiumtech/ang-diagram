import { EnumFigureType } from '../../shared/enum/figure-type.enum';

export interface ShapeModel {
  type?: EnumFigureType;
  background?: string;
  borderColor?: string;
  borderSize?: number;
}
