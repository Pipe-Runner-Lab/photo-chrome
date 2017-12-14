import { Component, OnInit } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-main-tools',
  templateUrl: './main-tools.component.html',
  styleUrls: ['./main-tools.component.css']
})
export class MainToolsComponent implements OnInit {

  onChangeToolType(toolType:string):void{
    this.utilService.changeToolType(toolType);
  }

  constructor(private utilService: UtilService) { }

  ngOnInit() {
  }

}
