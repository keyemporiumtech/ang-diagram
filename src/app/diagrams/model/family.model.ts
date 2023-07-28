import { StateNodeModel } from '../../shared/model/state-node.model';

export interface FamilyModel extends StateNodeModel {
  key: number | string;
  parent?: number | string;
  name: string;
  gender: 'M' | 'F';
  birthYear?: number | string;
  deathYear?: number | string;
}
