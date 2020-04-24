import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";

import { EntityService } from "../../../services/entity.service";  // FIXME

@Component({
  selector: 'app-detail-cell-renderer',
  templateUrl: './detail-cell-renderer.component.html',
  styleUrls: ['./detail-cell-renderer.component.scss']
})
export class DetailCellRendererComponent implements ICellRendererAngularComp {
    public details: any = "Howdie!";
    private row: any;

    constructor(private entityService: EntityService) {
    }
    
    // called on init
    agInit(params: any): void {
        console.log('Inside detail render init');
        console.log(params);
        console.log(params.data.details);
        this.row = params.data;
        this.details = params.data.details;
    }

    // called when the cell is refreshed
    refresh(params: any): boolean {
        return false;
    }

    onChange($event) {
        console.log('onChange: write to row ' + this.row.item);
        console.log(this.row);
        let feedback = []; // FIXME 'Need To Check in DetailCellRendererComponent'; //  this.ctxtSvc.getFeedback();
        feedback[this.row.item] = this.row;
    }
}
