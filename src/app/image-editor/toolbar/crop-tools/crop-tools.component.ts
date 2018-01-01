import { Component, OnInit, Input } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-crop-tools',
  templateUrl: './crop-tools.component.html',
  styleUrls: ['./crop-tools.component.css']
})
export class CropToolsComponent implements OnInit {

  @Input() selectedToolType;

  onCropCancel(){
    this.utilService.canvasCommand('STOP_CROP',{});
  }

  onCropFinish(){
    this.utilService.canvasCommand('FINISH_CROP',{});
  }

  constructor(private utilService:UtilService) { }

  ngOnInit() {
  }

}
