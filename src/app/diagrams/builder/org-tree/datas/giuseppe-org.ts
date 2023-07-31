import { OrgModel } from '../../../model/org.model';

export class GiuseppeOrg {
  static makeData() {
    const n0: OrgModel = {
      key: 'n0',
      name: 'Giuseppe Sassone',
      title: 'CEO',
      pic: 'user.png',
    };
    const n01: OrgModel = {
      key: 'n01',
      name: 'Manolo Lelli',
      title: 'Developer',
      pic: 'user.png',
      parent: 'n0',
    };
    const n02: OrgModel = {
      key: 'n02',
      name: 'Riccardo Cunto',
      title: 'Developer',
      pic: 'user.png',
      parent: 'n0',
    };

    return [n0, n01, n02];
  }

  static makeLink() {
    return [];
  }
}
