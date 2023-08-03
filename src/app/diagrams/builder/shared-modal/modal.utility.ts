export class ModalUtility {
  static setTitle(title: string) {
    const myModalTitle = document.getElementById('myModalTitle');
    (myModalTitle as any).innerHTML = title;
  }

  static setDetail(content: string) {
    const myModalContent = document.getElementById('myModalContentDetail');
    (myModalContent as any).style.display = 'unset';
    const otherModalContent = document.getElementById('myModalContentSave');
    (otherModalContent as any).style.display = 'none';
    (myModalContent as any).innerHTML = content;
  }
  static setEditing(content?: string) {
    const myModalContent = document.getElementById('myModalContentSave');
    (myModalContent as any).style.display = 'unset';
    const otherModalContent = document.getElementById('myModalContentDetail');
    (otherModalContent as any).style.display = 'none';
    if (content) {
      (myModalContent as any).innerHTML = content;
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
