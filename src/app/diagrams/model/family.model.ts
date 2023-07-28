export interface FamilyModel {
  key: number | string;
  parent?: number | string;
  name: string;
  gender: 'M' | 'F';
  birthYear?: number | string;
  deathYear?: number | string;
}
