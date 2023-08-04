import { EnumFigureType } from '../../../../shared/enum/figure-type.enum';
import { FamilyModel } from '../../../model/family.model';

export class FamilyTreeUtility {
  static maleColor: string = '#90CAF9';
  static femaleColor: string = '#F48FB1';
  static typeShape: EnumFigureType = EnumFigureType.RETTANGOLO;
  static textMales: string = 'Males';
  static textFemales: string = 'Females';

  static tooltipTextConverter(person: FamilyModel) {
    var str = '';
    str += 'Born: ' + person.birthYear;
    if (person.deathYear !== undefined) str += '\nDied: ' + person.deathYear;
    return str;
  }

  static genderBrushConverter = (gender: 'M' | 'F') => {
    if (gender === 'M') return this.maleColor;
    if (gender === 'F') return this.femaleColor;
    return 'orange';
  };
}
