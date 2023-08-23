import { FamilyModel } from '../../../model/family.model';
import { FamilyTreeUtility } from '../utility/family-tree.utility';

export class GiuseppeFamily {
  static makeData() {
    const as52: FamilyModel = {
      key: 'as52',
      name: 'Antonio Sassone',
      gender: 'M',
      birthDate: new Date('1952-03-25'),
      deathDate: undefined,
      father: 'ds35',
    };
    const mgv55: FamilyModel = {
      key: 'mgv55',
      name: 'Maria Giuseppa Vanni',
      gender: 'F',
      birthDate: new Date('1955-10-13'),
      deathDate: undefined,
    };
    const gs81: FamilyModel = {
      key: 'gs81',
      name: 'Giuseppe Sassone',
      gender: 'M',
      birthDate: new Date('1981-05-25'),
      deathDate: undefined,
      father: 'as52',
      mother: 'mgv55',
    };

    const ds76: FamilyModel = {
      key: 'ds76',
      name: 'Domenico Sassone',
      gender: 'M',
      birthDate: new Date('1976-10-02'),
      deathDate: undefined,
      father: 'as52',
      mother: 'mgv55',
    };

    const ds35: FamilyModel = {
      key: 'ds35',
      name: 'Domenico Sassone',
      gender: 'M',
      birthDate: new Date('1935-10-13'),
      deathDate: new Date('1995-05-15'),
    };
    const gs46: FamilyModel = {
      key: 'gs46',
      name: 'Giuseppe Sassone',
      gender: 'M',
      birthDate: new Date('1946-10-13'),
      deathDate: undefined,
      father: 'ds35',
    };

    const data = [as52, mgv55, gs81, ds76, ds35, gs46];

    return data;
  }

  static makeLink() {
    const data = GiuseppeFamily.makeData();
    return FamilyTreeUtility.makeLinks(data);
  }
}
