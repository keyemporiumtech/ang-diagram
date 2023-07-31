import { FamilyModel } from '../../../model/family.model';

export class GiuseppeFamily {
  static makeData() {
    const as52: FamilyModel = {
      key: 'as52',
      name: 'Antonio Sassone',
      gender: 'M',
      birthYear: '1952',
      deathYear: undefined,
    };
    const mgv55: FamilyModel = {
      key: 'mgv55',
      name: 'Maria Giuseppa Vanni',
      gender: 'F',
      birthYear: '1955',
      deathYear: undefined,
    };
    const gs81: FamilyModel = {
      key: 'gs81',
      name: 'Giuseppe Sassone',
      gender: 'M',
      birthYear: '1981',
      deathYear: undefined,
    };

    const ds76: FamilyModel = {
      key: 'ds76',
      name: 'Domenico Sassone',
      gender: 'M',
      birthYear: '1976',
      deathYear: undefined,
    };

    const ds35: FamilyModel = {
      key: 'ds35',
      name: 'Domenico Sassone',
      gender: 'M',
      birthYear: '1935',
      deathYear: '1995',
    };
    const gs46: FamilyModel = {
      key: 'gs46',
      name: 'Giuseppe Sassone',
      gender: 'M',
      birthYear: '1946',
      deathYear: undefined,
    };

    return [as52, mgv55, gs81, ds76, ds35, gs46];
  }

  static makeLink() {
    const links: any[] = [
      { key: -1, from: 'ds35', to: 'gs46' },
      { key: -2, from: 'ds35', to: 'as52' },
      { key: -3, from: 'as52', to: 'ds76' },
      { key: -4, from: 'as52', to: 'gs81' },
      { key: -5, from: 'mgv55', to: 'ds76', color: 'red' },
      { key: -6, from: 'mgv55', to: 'gs81', color: 'red' },
    ];

    return links;
  }
}
