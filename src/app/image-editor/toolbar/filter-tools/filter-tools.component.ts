import { Component, OnInit, Input } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-filter-tools',
  templateUrl: './filter-tools.component.html',
  styleUrls: ['./filter-tools.component.css']
})
export class FilterToolsComponent implements OnInit {

  @Input() selectedToolType;
  @Input() activeObjectProps;

  private filterScope:string;
  private panelType:string;
  private filterValues:any;

  onPanelChange(panelType:string):void{
    this.panelType = panelType;
  }

  toggleScope(filterScope){
    this.filterScope = filterScope;
    if(this.filterScope === 'ALL'){
      this.utilService.getGlobalData('FILTER:ALL');
    }
  }

  togglePreset(presetType):void{
    this.filterValues = {...this.filterValues,[`${presetType}`]:!this.filterValues[`${presetType}`]}
    this.onFilterUpdate();
  }

  onFilterUpdate():void{
    this.utilService.addImageFilter(this.filterScope,this.filterValues);
  }

  constructor(private utilService:UtilService) {
    this.panelType = 'ADVANCED';
    this.filterValues = {
      brightness:0,
      contrast:0,
      saturation:0,
      hue:0,
      noise:0,
      blur:0,
      pixelate:0,
      sharpen:false,
      emboss:false,
      grayscale:false,
      vintage:false,
      sepia:false,
      polaroid:false
    };
  }

  ngOnInit() {
    this.filterScope = this.filterScope;
    console.log(this.filterValues);
    this.filterValues = this.activeObjectProps;
  }

  ngOnChanges(){
    if(this.selectedToolType === 'FILTER:ALL'){
      this.filterScope = 'ALL'
    }
    else if(this.selectedToolType === 'FILTER:SINGLE'){
      this.filterScope = 'SINGLE'
    }

    this.filterValues = this.activeObjectProps;
  }
}
