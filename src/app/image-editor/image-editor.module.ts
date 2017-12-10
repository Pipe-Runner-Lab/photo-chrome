import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';

import { CanvasComponent } from './canvas/canvas.component';
import { ImageEditorComponent } from './image-editor.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { MenubarComponent } from './menubar/menubar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CanvasComponent, ImageEditorComponent, ToolbarComponent, ImagePickerComponent, MenubarComponent],
  exports:[ImageEditorComponent]
})
export class ImageEditorModule { }
