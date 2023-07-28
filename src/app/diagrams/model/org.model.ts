import { StateNodeModel } from '../../shared/model/state-node.model';

export interface OrgModel extends StateNodeModel {
  key: number | string;
  parent?: number | string;
  name: string;
  title: string;
  pic: string;
}
