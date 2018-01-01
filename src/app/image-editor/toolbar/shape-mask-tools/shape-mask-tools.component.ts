import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../util.service';

@Component({
  selector: 'app-shape-mask-tools',
  templateUrl: './shape-mask-tools.component.html',
  styleUrls: ['./shape-mask-tools.component.css']
})
export class ShapeMaskToolsComponent implements OnInit {

  @Input() selectedToolType;
  @Input() activeObjectProps;

  private color: string;
  private opacity: number; 
  private shadowAmount: number;
  private shadowBlur: number;
  private shadowOffsetX: number;
  private shadowOffsetY: number;
  
  onUpdateShapeMask(){
    this.utilService.onUpdateShapeMask(
      {
        color: this.color,
        opacity: this.opacity,
        shadowAmount: this.shadowAmount,
        shadowBlur: this.shadowBlur,
        shadowOffsetX: this.shadowOffsetX,
        shadowOffsetY: this.shadowOffsetY
      }
    );
  }

  addShapeMask(shape){
    this.utilService.canvasCommand('ADD_SHAPE_MASK',{
      shape: shape,
      color: this.color,
      opacity: this.opacity,
      shadowAmount: this.shadowAmount,
      shadowBlur: this.shadowBlur,
      shadowOffsetX: this.shadowOffsetX,
      shadowOffsetY: this.shadowOffsetY
    });
  }

  constructor(private utilService: UtilService) {
  }

  ngOnInit() {
    this.color = this.activeObjectProps.color ? this.activeObjectProps.color : '#F0E58C';
    this.opacity = this.activeObjectProps.opacity ? this.activeObjectProps.opacity : 0.5;
    this.shadowAmount = this.activeObjectProps.shadowAmount ? this.activeObjectProps.shadowAmount : 0;
    this.shadowBlur = this.activeObjectProps.shadowBlur ? this.activeObjectProps.shadowBlur : 0;
    this.shadowOffsetX = this.activeObjectProps.shadowOffsetX ? this.activeObjectProps.shadowOffsetX : 0;
    this.shadowOffsetY = this.activeObjectProps.shadowOffsetY ? this.activeObjectProps.shadowOffsetY : 0;
  }

  ngOnChanges(){
    this.color = this.activeObjectProps.color;
    this.opacity = this.activeObjectProps.opacity;
    this.shadowAmount = this.activeObjectProps.shadowAmount;
    this.shadowBlur = this.activeObjectProps.shadowBlur;
    this.shadowOffsetX = this.activeObjectProps.shadowOffsetX;
    this.shadowOffsetY = this.activeObjectProps.shadowOffsetY;
  }

}
