import { EnumKanbanStatus, KanbanModel } from '../../../model/kanban.model';

export class SGP20Kanban {
  static makeData(): KanbanModel[] {
    const n0: KanbanModel = {
      key: 'n0',
      text: 'Obiettivo 18/09',
      isGroup: true,
      color: EnumKanbanStatus.IN_PROGRESS,
      percent: 0,
    };
    const n1: KanbanModel = {
      key: 'n1',
      text: 'Obiettivo 13/11',
      isGroup: true,
      color: EnumKanbanStatus.NONE,
      percent: 0,
    };
    const n2: KanbanModel = {
      key: 'n2',
      text: 'Paralleli',
      isGroup: true,
      color: EnumKanbanStatus.NONE,
      percent: 0,
    };

    // -------- n0
    const n01: KanbanModel = {
      key: 'n01',
      text: 'Provvedimento',
      color: EnumKanbanStatus.IN_PROGRESS,
      group: 'n0',
      percent: 30,
      persons: ['Federica Ippoliti', 'Claudio Torroni'],
    };
    const n02: KanbanModel = {
      key: 'n02',
      text: 'Revisioni attive e passive',
      color: EnumKanbanStatus.IN_PROGRESS,
      group: 'n0',
      percent: 40,
      persons: ['Carla Di Persio', 'Nikoll Dodaj', 'Manolo Lelli'],
    };
    const n03: KanbanModel = {
      key: 'n03',
      text: 'Fase Esito Mortale',
      color: EnumKanbanStatus.IN_PROGRESS,
      group: 'n0',
      percent: 70,
      persons: ['Silvia Mariani', 'Ejona Aliaj', 'Kejsi Butka'],
    };
    const n04: KanbanModel = {
      key: 'n04',
      text: 'Fase Riammissione in temporanea',
      color: EnumKanbanStatus.IN_PROGRESS,
      group: 'n0',
      percent: 70,
      persons: ['Sara Iannone', 'Davide Feliciello', 'Xheni Haxiu'],
    };
    const n05: KanbanModel = {
      key: 'n05',
      text: 'Cambio Competenza',
      color: EnumKanbanStatus.STOPPED,
      group: 'n0',
      percent: 0,
    };
    const n06: KanbanModel = {
      key: 'n05',
      text: 'Incarico a Trattare',
      color: EnumKanbanStatus.STOPPED,
      group: 'n0',
      percent: 0,
    };

    // -------- n1
    const n11: KanbanModel = {
      key: 'n11',
      text: 'Prestazioni Economiche',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };
    const n12: KanbanModel = {
      key: 'n12',
      text: 'Validazioni',
      color: EnumKanbanStatus.IN_PROGRESS,
      group: 'n1',
      percent: 0,
    };
    const n13: KanbanModel = {
      key: 'n13',
      text: 'Fase Opposizione',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };
    const n14: KanbanModel = {
      key: 'n14',
      text: 'Wizard Generalità Persona',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };
    const n15: KanbanModel = {
      key: 'n15',
      text: 'Wizard Generalità Persona - Dati Reddituali',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };
    const n16: KanbanModel = {
      key: 'n16',
      text: 'Wizard Rapporti Economici e Familiari',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };
    const n17: KanbanModel = {
      key: 'n17',
      text: 'Lavorazione documenti persona',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };
    const n18: KanbanModel = {
      key: 'n18',
      text: 'Fase Richiesta Prestazione Economica',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };
    const n19: KanbanModel = {
      key: 'n19',
      text: 'Riattivazione tab Sanitari',
      color: EnumKanbanStatus.STOPPED,
      group: 'n1',
      percent: 0,
    };

    // -------- n1
    const n21: KanbanModel = {
      key: 'n21',
      text: 'Creazione Fase Persona',
      color: EnumKanbanStatus.IN_PROGRESS,
      group: 'n2',
      percent: 0,
    };

    return [
      n0,
      n1,
      n2,
      n01,
      n03,
      n04,
      n05,
      n06,
      n11,
      n12,
      n13,
      n02,
      n14,
      n15,
      n16,
      n17,
      n18,
      n19,
      n21,
    ];
  }

  static makeLink() {
    return [];
  }
}
