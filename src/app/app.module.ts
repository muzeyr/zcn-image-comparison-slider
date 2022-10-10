import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import * as test from './test-component.component';
import { NgxImageComparisonSliderModule } from 'ngx-image-comparison-slider';
import { BackToTopComponent } from './back-to-top.component';

@NgModule({
  imports: [BrowserModule, FormsModule, NgxImageComparisonSliderModule],
  declarations: [
    AppComponent,
    BackToTopComponent,
    test.NgxImageComparisonSliderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
