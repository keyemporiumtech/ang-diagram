export class ModalUtility {
  static setTitle(title: string) {
    const myModalTitle = document.getElementById('myModalTitle');
    (myModalTitle as any).innerHTML = title;
  }

  static setDetail(content?: string) {
    const modalDetail = document.getElementById('myModalContentDetail');
    (modalDetail as any).style.display = 'unset';
    const modalUpdate = document.getElementById('myModalContentUpdate');
    (modalUpdate as any).style.display = 'none';
    const modalSave = document.getElementById('myModalContentSave');
    (modalSave as any).style.display = 'none';

    if (content) {
      (modalDetail as any).innerHTML = content;
    }
  }
  static setUpdate(content?: string) {
    const modalDetail = document.getElementById('myModalContentDetail');
    (modalDetail as any).style.display = 'none';
    const modalUpdate = document.getElementById('myModalContentUpdate');
    (modalUpdate as any).style.display = 'unset';
    const modalSave = document.getElementById('myModalContentSave');
    (modalSave as any).style.display = 'none';

    if (content) {
      (modalUpdate as any).innerHTML = content;
    }
  }

  static setSave(content?: string) {
    const modalDetail = document.getElementById('myModalContentDetail');
    (modalDetail as any).style.display = 'none';
    const modalUpdate = document.getElementById('myModalContentUpdate');
    (modalUpdate as any).style.display = 'none';
    const modalSave = document.getElementById('myModalContentSave');
    (modalSave as any).style.display = 'unset';

    if (content) {
      (modalSave as any).innerHTML = content;
    }
  }

  static setDataDetail(content: any) {
    const dataInput = document.getElementById('dataDetailFromEvent');
    (dataInput as any).value = JSON.stringify(content);
    const event = new Event('change');
    (dataInput as any).dispatchEvent(event);
  }
  static setDataUpdate(content: any) {
    const dataInput = document.getElementById('dataUpdateFromEvent');
    (dataInput as any).value = JSON.stringify(content);
    const event = new Event('change');
    (dataInput as any).dispatchEvent(event);
  }
  static setDataSave(content: any) {
    const dataInput = document.getElementById('dataSaveFromEvent');
    (dataInput as any).value = JSON.stringify(content);
    const event = new Event('change');
    (dataInput as any).dispatchEvent(event);
  }

  static openModal() {
    (document.getElementById('myModalOpen') as any).click();
  }

  static hideSave() {
    (document.getElementById('myModalSave') as any).style.display = 'none';
  }
  static showSave() {
    (document.getElementById('myModalSave') as any).style.display = 'unset';
  }

  static hideUpdate() {
    (document.getElementById('myModalUpdate') as any).style.display = 'none';
  }
  static showUpdate() {
    (document.getElementById('myModalUpdate') as any).style.display = 'unset';
  }

  static hideEditing() {
    ModalUtility.hideSave();
    ModalUtility.hideUpdate();
  }

  static showEditing() {
    ModalUtility.showSave();
    ModalUtility.showUpdate();
  }
}
