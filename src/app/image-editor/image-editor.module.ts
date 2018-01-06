import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule,MatIconModule,MatGridListModule,MatSliderModule,MatTooltipModule,MatSelectModule,MatSnackBarModule,MatMenuModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { CanvasComponent } from './canvas/canvas.component';
import { ImageEditorComponent } from './image-editor.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { MenubarComponent } from './menubar/menubar.component';

import { UtilService } from './util.service';
import { MainToolsComponent } from './toolbar/main-tools/main-tools.component';
import { FilterToolsComponent } from './toolbar/filter-tools/filter-tools.component';
import { TextToolsComponent } from './toolbar/text-tools/text-tools.component';
import { CropToolsComponent } from './toolbar/crop-tools/crop-tools.component';
import { ShapeMaskToolsComponent } from './toolbar/shape-mask-tools/shape-mask-tools.component';
import { PenToolsComponent } from './toolbar/pen-tools/pen-tools.component'

@NgModule({
  imports: [
    CommonModule,    
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    FormsModule,
    MatSliderModule,
    ColorPickerModule,
    MatTooltipModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  declarations: [CanvasComponent, ImageEditorComponent, ToolbarComponent, ImagePickerComponent, MenubarComponent, MainToolsComponent, FilterToolsComponent, TextToolsComponent, CropToolsComponent, ShapeMaskToolsComponent, PenToolsComponent],
  exports:[ImageEditorComponent],
  providers:[UtilService]
})
export class ImageEditorModule {
  
}
