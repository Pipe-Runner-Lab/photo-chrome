import { Component, OnInit, Input } from '@angular/core';
import {UtilService} from '../../util.service';

@Component({
  selector: 'app-pen-tools',
  templateUrl: './pen-tools.component.html',
  styleUrls: ['./pen-tools.component.css']
})
export class PenToolsComponent implements OnInit {
  @Input() selectedToolType;
  @Input() activeObjectProps;

  constructor(private utilService:UtilService) {

  }

  ngOnInit() {
  }

}
