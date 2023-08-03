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
  @Input() saveTemplate: TemplateRef<any>;
  @ViewChild('dataDetailFromEvent') dataDetailFromEvent: ElementRef<any>;
  @ViewChild('dataUpdateFromEvent') dataUpdateFromEvent: ElementRef<any>;
  @Output() saveModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dataDetailChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataUpdateChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngAfterViewInit(): void {}

  saveClick() {
    this.saveModal.emit(true);
  }
  updateClick() {
    this.updateModal.emit(true);
  }

  getDataDetail(): any {
    if (
      this.dataDetailFromEvent &&
      this.dataDetailFromEvent.nativeElement.value
    ) {
      return JSON.parse(this.dataDetailFromEvent.nativeElement.value);
    }
  }
  changeDataDetail($event: any) {
    this.dataDetailChange.emit(this.getDataDetail());
  }

  getDataUpdate(): any {
    if (
      this.dataUpdateFromEvent &&
      this.dataUpdateFromEvent.nativeElement.value
    ) {
      return JSON.parse(this.dataUpdateFromEvent.nativeElement.value);
    }
  }
  changeDataUpdate($event: any) {
    this.dataUpdateChange.emit(this.getDataUpdate());
  }

  ngOnDestroy() {}
}
