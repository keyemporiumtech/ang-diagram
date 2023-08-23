import { StateNodeModel } from '../../shared/model/state-node.model';

export interface FamilyModel extends StateNodeModel {
  key: number | string | undefined;
  father?: number | string;
  mother?: number | string;
  name: string;
  gender: 'M' | 'F';
  birthDate?: Date;
  deathDate?: Date;
  // others
  fatherObj?: FamilyModel;
  motherObj?: FamilyModel;
}
