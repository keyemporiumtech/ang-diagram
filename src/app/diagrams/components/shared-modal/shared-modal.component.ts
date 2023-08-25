import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss'],
})
export class SharedModalComponent implements AfterViewInit {
  @Input() detailTemplate: TemplateRef<any>;
  @Input() updateTemplate: TemplateRef<any>;
  @Input() saveTemplate: TemplateRef<any>;
  @ViewChild('dataDetailFromEvent') dataDetailFromEvent: ElementRef<any>;
  @ViewChild('dataUpdateFromEvent') dataUpdateFromEvent: ElementRef<any>;
  @ViewChild('dataSaveFromEvent') dataSaveFromEvent: ElementRef<any>;
  @Output() saveModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dataDetailChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataUpdateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataSaveChange: EventEmitter<any> = new EventEmitter<any>();
  // vars
  typeOperation: 'DETAIL' | 'UPDATE' | 'SAVE' | 'NONE' = 'NONE';
  // ------------------- MANAGE VALIDATIONS
  messages: string[] = [];

  constructor() {}

  ngAfterViewInit(): void {}

  // click
  saveClick() {
    this.saveModal.emit(true);
  }
  updateClick() {
    this.updateModal.emit(true);
  }

  // ------------- detail
  getDataDetail(): any {
    if (
      this.dataDetailFromEvent &&
      this.dataDetailFromEvent.nativeElement.value
    ) {
      return JSON.parse(this.dataDetailFromEvent.nativeElement.value);
    }
  }
  changeDataDetail($event: any) {
    this.emptyMessages();
    this.typeOperation = 'DETAIL';
    this.dataDetailChange.emit(this.getDataDetail());
  }

  // ------------- update
  getDataUpdate(): any {
    if (
      this.dataUpdateFromEvent &&
      this.dataUpdateFromEvent.nativeElement.value
    ) {
      return JSON.parse(this.dataUpdateFromEvent.nativeElement.value);
    }
  }
  changeDataUpdate($event: any) {
    this.emptyMessages();
    this.typeOperation = 'UPDATE';
    this.dataUpdateChange.emit(this.getDataUpdate());
  }

  // ------------- save
  getDataSave(): any {
    if (this.dataSaveFromEvent && this.dataSaveFromEvent.nativeElement.value) {
      return JSON.parse(this.dataSaveFromEvent.nativeElement.value);
    }
  }
  changeDataSave($event: any) {
    this.emptyMessages();
    this.typeOperation = 'SAVE';
    this.dataSaveChange.emit(this.getDataSave());
  }

  // ----------- MESSAGES
  setMessage(message: string): void {
    this.messages.push(message);
  }
  setMessages(messages: string[]): void {
    this.messages.push(...messages);
  }
  emptyMessages() {
    this.messages.length = 0;
  }

  hasMessage(): boolean {
    return this.messages.length > 0;
  }

  ngOnDestroy() {}
}
