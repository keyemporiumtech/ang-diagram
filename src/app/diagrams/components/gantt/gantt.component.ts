import * as go from 'gojs';
import produce from 'immer';
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DiagramBaseComponent } from '../../abstract/diagram-base.component';
import { GanttTemplate } from '../../builder/gantt/gantt.template';
import { DataSyncService, DiagramComponent } from 'gojs-angular';
@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttComponent {
  public loadScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/js/loadGantt.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit() {
    this.loadScript();
  }

  ngAfterViewInit(): void {}
}
