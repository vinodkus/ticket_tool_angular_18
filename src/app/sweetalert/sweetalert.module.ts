// sweetalert.module.ts
import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [SweetAlert2Module.forRoot()],
  exports: [SweetAlert2Module]
})
export class SweetalertModule { }
