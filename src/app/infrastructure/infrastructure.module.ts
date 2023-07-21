import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageStructTestComponent } from './test/page-struct-test/page-struct-test.component';
import { FormsModule } from '@angular/forms';
import { GojsAngularModule } from 'gojs-angular';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PageStructTestComponent],
  imports: [CommonModule, FormsModule, GojsAngularModule, SharedModule],
  exports: [PageStructTestComponent],
})
export class InfrastructureModule {
  static forRoot() {
    return {
      ngModule: InfrastructureModule,
      providers: [],
    };
  }
}
