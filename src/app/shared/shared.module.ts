import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjDiagramComponent } from './components/obj-diagram/obj-diagram.component';
import { InspectorComponent } from './components/inspector/inspector.component';
import { InspectorRowComponent } from './components/inspector-row/inspector-row.component';
import { FormsModule } from '@angular/forms';
import { GojsAngularModule } from 'gojs-angular';

@NgModule({
  declarations: [
    ObjDiagramComponent,
    InspectorComponent,
    InspectorRowComponent,
  ],
  imports: [CommonModule, FormsModule, GojsAngularModule],
  exports: [ObjDiagramComponent, InspectorComponent, InspectorRowComponent],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
