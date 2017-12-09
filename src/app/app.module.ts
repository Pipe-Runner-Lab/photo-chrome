import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ImageEditorModule} from './image-editor/image-editor.module'


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImageEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
