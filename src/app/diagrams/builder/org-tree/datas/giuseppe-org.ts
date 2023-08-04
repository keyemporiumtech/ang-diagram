import { OrgModel } from '../../../model/org.model';

export class GiuseppeOrg {
  static makeData() {
    const n0: OrgModel = {
      key: 'n0',
      name: 'Giuseppe Sassone',
      role: 'CEO',
      pic: 'user.png',
      matricola: 'XX0001',
    };
    const n01: OrgModel = {
      key: 'n01',
      name: 'Manolo Lelli',
      role: 'Developer',
      pic: 'user.png',
      parent: 'n0',
      matricola: 'ZY0001',
    };
    const n02: OrgModel = {
      key: 'n02',
      name: 'Riccardo Cunto',
      role: 'Developer',
      pic: 'user.png',
      parent: 'n0',
      matricola: 'XY0001',
    };

    return [n0, n01, n02];
  }

  static makeLink() {
    return [
      { key: -1, from: 'n0', to: 'n01' },
      { key: -2, from: 'n0', to: 'n02' },
    ];
  }
}
