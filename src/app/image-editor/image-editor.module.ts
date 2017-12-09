import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas/canvas.component';
import { ImageEditorComponent } from './image-editor.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CanvasComponent, ImageEditorComponent, ToolbarComponent],
  exports:[ImageEditorComponent]
})
export class ImageEditorModule { }
