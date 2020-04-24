import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';

import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from "ag-grid-community/main";
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material';

import ScoreFilter from './filters/scoreFilter';
import FeatureFilter from './filters/featureFilter';
import RefData from './data/refData';

// only import this if you are using the ag-Grid-Enterprise
// import {Grid} from 'ag-grid-enterprise'; FIXME
import 'ag-grid-enterprise/main';

import { HeaderGroupComponent } from "./header-group/header-group.component";
import { DateComponent } from "./date/date.component";
import { HeaderComponent } from "./header/header.component";
import { DetailCellRendererComponent } from './detail-cell-renderer/detail-cell-renderer.component';

import { Page } from '../../pagination';
import { Entity } from "../../models/entity";
import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";

import { MatDialog, MatDialogConfig } from "@angular/material";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { BulkDialogComponent } from '../bulk-dialog/bulk-dialog.component';

@Component({
  selector: 'app-entity-grid',
  templateUrl: './entity-grid.component.html',
  styleUrls: ['./entity-grid.component.css']
})
export class EntityGridComponent implements OnInit {
    @Input('page') page$: any;
    private gridOptions: GridOptions;
    public showGrid: boolean;
    private context: any;
    public rowData: any[];
    private columnDefs: any[];
    public rowCount: string;
    public dateComponentFramework: DateComponent;
    public HeaderGroupComponent = HeaderGroupComponent;
    // FIXME: 2nd Argument added for Angular 8
    @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
    public quickFilterText: string = '';
    private feedback = {};
    private experience = 'None';
    private comments = '';

    private overlayLoadingTemplate;
    private overlayNoRowsTemplate;

    items: any; // Product[];
    subscriber: any;
    pageSize: number;

    private detailCellRenderer;
    private detailRowHeight;
    private frameworkComponents;

    // page: Observable<Page<Entity>>;
    entities: any;
    selectedEntities: any;
    checkState: boolean = false;
    bulkAction: string = 'none';
    bulkActionList = {};


    constructor(
        private entityService: EntityService,
        private snackBar: MatSnackBar
    ) {
        console.log('EntityGridComponent.constructor()');
        // this.entities = db.collection('products', ref => ref.orderBy('name').limit(3)).valueChanges();
        //this.entities = db.collection('/products').valueChanges(); 
        //console.log('Fetched products');
        this.pageSize = 100;
        this.gridOptions = <GridOptions>{};
        this.overlayLoadingTemplate =
            '<span class="ag-overlay-loading-center" style="color:#8A8A8A; border: 0px solid; align:center;">Loading data...<br /><i style="align:center; color:#8A8A8A; margin-left: 50px;" class="fa fa-spinner fa-spin fa-w-32 fa-4x"></span>';
	    // '<span class="ag-overlay-loading-center">Please wait while the data is loading</span>';
        this.overlayNoRowsTemplate =
            // '<i style="align:center; color:#FEBE89; margin-left: 50px;" class="fa fa-spinner fa-spin fa-w-32 fa-5x"></i>';
            "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">No rows yet. Perhaps you need to enter Cutomer No/Remedy ID</span>";
	    // '</i><span class="ag-overlay-loading-center">Please wait while the data is loading</span>';
        // this.entityService.setGridOptions(this.gridOptions) FIXME
        // this.entityService.setFeedback(this.feedback); FIXME
    }

    ngOnInit() {
        console.log('EntityGridComponent.ngOnInit()');
        this.createColumnDefs();
        this.showGrid = true;
        this.gridOptions.dateComponentFramework = DateComponent;

        this.gridOptions.defaultColDef = {
            headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
            headerComponentParams: {
                menuIcon: 'fa-bars'
            }
        }

        this.gridOptions.rowHeight = 32;
        this.detailCellRenderer = "myDetailCellRenderer";
        this.detailRowHeight = 100;
        this.frameworkComponents = { myDetailCellRenderer: DetailCellRendererComponent };

        console.log(`EntityGridComponent.ngOnInit(${this.page$})`);
        // this.gridOptions.fontSize = 12;
        // this.gridOptions.autoHeight=true;
	// this.context = this.entityService.getContext();
        this.subscriber = this.page$.subscribe(data => {
	    console.log('EntityGridComponent.PageSubscription()');
            this.entities = data.results;
            console.log(this.entities);
            console.log(`Number of records: ${this.entities.length}`);
	    this.checkState = false;
            delete this.selectedEntities;
	    this.selectedEntities = {};
            this.bulkActionList = {};
            this.entities.forEach(entity => {
                this.selectedEntities[entity.id] = this.checkState;
            });
	    this.quickFilterText = '';
            this.createRowData();
        });

	/* For hiding
        this.gridOptions.isExternalFilterPresent = () => {return true;};
        this.gridOptions.doesExternalFilterPass = (node) => {
            return !node.data.pitched;
        };
	*/
        
        /*
	let params = { 
	    headers: {},
	    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
	    queryStringParameters: {}
	}

	API.get('upsellapi', '/patch', params).then(response => {
	    // Add your code here
	    debugger;
	}).catch(error => {
	    console.log(error.response)
	    debugger;
	});
        */
    }

    ngOnExit() {
        console.log('EntityGridComponent.ngOnExit()');
        this.subscriber.unsubscribe();
    }

    private createRowData() {
        var rowData: any[] = [];
        //this.entities = this.entityService.fetchProducts();
        //console.log('Number of records fetched: ' + this.entities.length);

        for (var i = 0; i < this.entities.length; i++) {
            rowData.push({
                item: this.entities[i]['name'],
                details: {
                    "issue_cause": this.entities[i]['email'],
                    "issue_type": this.entities[i]['issue_type'],                    
                    "bname": this.entities[i]['address'],
                    "bgflag": this.entities[i]['B_G_FLAG'],
                    "ndc": this.entities[i]['latitude'],
                    "mfg": this.entities[i]['longitude'],
                    "strength": this.entities[i]['Strength'],
                    "uom": this.entities[i]['Strength_UoM'],
                    "size": this.entities[i]['Size'],
                    "form": this.entities[i]['Form'],
                    "pkg_qty": this.entities[i]['Pkg_Qty'],
                    "cd": this.entities[i]['NARCOTIC_CD'],
                    "comp_price": this.entities[i]['comp_price'],
                    "sku": this.entities[i]['sku'],
                },
                gppc: this.entities[i]['GPPC']? this.entities[i]['GPPC'] : ' ',
                happy: false, // this.entities[i]['Happy'],
                avg: this.entities[i]['avg'],
                sad: false, // this.entities[i]['Sad'],
                comp: this.entities[i]['comp'],
                issue_cause: this.entities[i]['issue_cause'],
                issue_type: this.entities[i]['issue_type'],
                gname: this.entities[i]['title'],
                gpid: this.entities[i]['GPID']? this.entities[i]['GPID']: ' ',
                bname: this.entities[i]['Brand_Name'],
                bgflag: this.entities[i]['B_G_FLAG'],
                ndc: this.entities[i]['NDC'],
                mfg: this.entities[i]['MFG'],
                strength: this.entities[i]['Strength'],
                uom: this.entities[i]['Strength_UoM'],
                size: this.entities[i]['Size'],
                form: this.entities[i]['Form'],
                pkg_qty: this.entities[i]['Pkg_Qty'],
                category: this.entities[i]['Theraputic_Cat']? this.entities[i]['Theraputic_Cat']: ' ',
                class: this.entities[i]['Theraputic_Class'],
                cd: this.entities[i]['NARCOTIC_CD'],
                features_raw: this.entities[i]['features'],
                /*
                features: {
                    history: this.entities[i]['features'][0],
                    market: this.entities[i]['features'][1],
                    opportunity: this.entities[i]['features'][2],
                    price_drop: this.entities[i]['features'][3],
                    narc: this.entities[i]['NARCOTIC_CD'] != "  "? 1: 0,
                    pet: this.entities[i]['petmeds']? this.entities[i]['petmeds']: 0, // FIXME Mynk
                    last: this.entities[i]['last'],
                },
                */
                score_raw: this.entities[i]['prob'] * this.entities[i]['markup'],
                score: Math.round(this.entities[i]['prob'] * this.entities[i]['markup']),
                prob: this.entities[i]['prob'],
                markup: this.entities[i]['markup'],
                ct: this.entities[i]['ct'],
                selected: this.entities[i]['selected'],
                pitched: false,
                last: this.entities[i]['last'],
            });
        }

        this.rowData = rowData;
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: "Item Number",
                headerGroupComponentFramework: HeaderGroupComponent,
                children: [
                    {
                        headerName: "", field: "item",
                        width: 105, suppressFilter: true,
                        cellRenderer: "agGroupCellRenderer",
			cellClassRules: {
			    'pitched': 'data.pitched' // 'data.cd != "  "'
			}			
                    },
                ]
            },
            {
                headerName: '', width: 40, checkboxSelection: true, suppressSorting: true,
                suppressMenu: true, pinned: true, suppressFilter: true, headerCheckboxSelection: true
            },
            {
                headerName: 'Highights',
                children: [
                    {
                        headerName: "",
                        width: 100, // 165,
                        suppressSorting: true,
                        cellRenderer: featuresCellRenderer,
                        filter: FeatureFilter,
                        getQuickFilterText: function (params) {
                            var features = ""
                            if (params.data.features.history) features += "history"
                            if (params.data.features.market) features += "supply issues"
                            if (params.data.features.opportunity) features += "competitive"
                            if (params.data.features.price_drop) features += "price drop"
                            if (params.data.features.narc) features += "controlled"
                            if (params.data.features.pet) features += "petmeds"
                            if (params.data.features.pet) features += "last"
                            //console.log(features);
                            return features;
                        }
                    },
                    /*
                    {
                        headerName: "Score",
                        field: "score",
                        width: 150,
                        cellRenderer: percentCellRenderer,
                        filter: ScoreFilter,
			sort: "desc",
                    },
                    */
                ]
            },
            {
                headerName: 'Reco',
                headerGroupComponentFramework: HeaderGroupComponent,
                children: [
                    {
                        headerName: "Helped", field: "happy",
                        width: 60, suppressMenu: true, suppressSorting: true, suppressFilter: true,
                        cellRenderer: happyCellRenderer,
                    },
                    {
                        headerName: "Nah", field: "sad",
                        width: 60, suppressMenu: true, suppressSorting: true, suppressFilter: true,
                        cellRenderer: sadCellRenderer,
                    },
                ]
            },
            {
                headerName: 'Item Information',
                headerGroupComponentFramework: HeaderGroupComponent,
                children: [
                    {
                        headerName: "Generic Name", field: "gname",
                        width: 300, // pinned: true
                    },
                    {
                        headerName: "Brand Name", field: "bname",
                        width: 120, suppressSorting: true,
			/*
			headerTooltip: 'Testing Tooltip',
			cellClassRules: {
			    'rag-red-outer': (params) => { return params.value === "ZITHROMAX"}
			},
			cellRenderer: (params) => {
			    return '<span class="rag-element">'+params.value+'</span>';
			}
			*/
                        //hide: true
			// FIXME, pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "NDC", field: "ndc",
                        width: 110,// suppressSorting: true, suppressFilter: true,
                        // hide: true
			// pinned: true, columnGroupShow: 'open'
                    }, 
                    {
                        headerName: "SZ", field: "size",
                        width: 70, suppressSorting: true,
                        //hide: true
			// pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "ST", field: "strength",
                        width: 70, suppressSorting: true,
                        //hide: true
			// pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "FM", field: "form",
                        width: 70, suppressSorting: true,
                        //hide: true
			// pinned: true, columnGroupShow: 'open'
                    },		    
                    {
                        headerName: "MFG", field: "mfg",
                        width: 80, suppressSorting: true,
			//hide: true
                        //columnGroupShow: 'open', pinned: true
                    },                    
                    {
                        headerName: "Therapeutic Category", field: "category",
                        width: 300,
			cellRenderer: (params) => {
			    return '<span style="color: #1A73E8; align: center">'+params.value+'</span>';
			}
                        // FIXME pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "H/G", field: "avg",
                        width: 70, suppressSorting: true, suppressFilter: true,
			hide: true
                    },
                    {
                        headerName: "Comp", field: "comp",
                        width: 80, suppressSorting: true, suppressFilter: true,
			headerTooltip: "Compares our RETAIL PRICE against competitor prices for a given item number.  This is the ratio of number of times that Anda's price was lower divided by number of times it was higher.",
                    },
                    {
                        headerName: "CT", field: "ct",
                        width: 80, suppressSorting: true,
			headerTooltip: 'Count gives the number of times this customer purchsed this item number / times this customer purchsed this item and other items in this GPPC.',
                        //columnGroupShow: 'open', pinned: true
                    },
                    {
                        headerName: '📅', field: "last",
                        width: 80, suppressSorting: true, suppressFilter: true, suppressMenu: true,
                        hide: true,
			//headerTooltip: 'Count gives the number of times this customer purchsed this item number / times this customer purchsed this item and other items in this GPPC.',
                        //columnGroupShow: 'open', pinned: true
                    },
                    /*
                ]
            },
            {
                headerName: 'Issue',
                headerGroupComponentFramework: HeaderGroupComponent,
                children: [
                    {
                        headerName: "Cause", field: "issue_cause",
                        width: 90, suppressSorting: true, suppressFilter: true
                    },
                    {
                        headerName: "Type", field: "issue_type",
                        width: 90, suppressSorting: true, suppressFilter: true
                    },
                ]
            },
            {
                headerName: 'Item Information Contd.',
                headerGroupComponentFramework: HeaderGroupComponent,
                children: [
                    */
                    {
                        headerName: "GPPC", field: "gppc",
                        width: 100, suppressSorting: true,
			suppressFilter: true,
			headerTooltip: 'Generic Product Packaging Codes group products together that share the same package description, package size, unit of measure, quantity, and unit dose.',
			cellRenderer: (params) => {
			    return '<span style="color: #1A73E8; text-align: center !important;">'+params.value+'</span>';
			}
                        // pinned: true, columnGroupShow: 'open', 
                    },
                    {
                        headerName: "GPID", field: "gpid",
                        width: 130, suppressSorting: true,
			suppressFilter: true,
			cellRenderer: (params) => {
			    return '<span style="color: #1A73E8; align: center">'+params.value+'</span>';
			}
                        // , pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "BG Flag", field: "bgflag",
                        width: 100, suppressSorting: true, suppressFilter: true,
                        hide: true
			//columnGroupShow: 'open', suppressFilter: true, pinned: true
                    },
                    {
                        headerName: "UoM", field: "uom",
                        width: 80, suppressSorting: true,
                        hide: true
			// pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "Qty", field: "pkg_qty",
                        width: 70, suppressSorting: true,
                        hide: true
			// pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "Narc", field: "cd",
                        width: 70, suppressSorting: true, suppressFilter: true,
                        //hide: true
		        // pinned: true, columnGroupShow: 'open'
                    },
                    {
                        headerName: "Therapeutic Class", field: "class",
                        width: 200,
                        //columnGroupShow: 'open', pinned: true
                    },
                    {
                        headerName: "Prob", field: "prob",
                        width: 80, suppressSorting: true,
			headerTooltip: 'Probability that the customer would be interested in this item number.  We calculate probabilities for just the top items.  The rest will have a default probability of 30.',
                        //columnGroupShow: 'open', pinned: true
                    },
                    {
                        headerName: "SM", field: "markup",
                        width: 70, suppressSorting: true,
			headerTooltip: 'Score Markup is a value by which we multiply the probability.  If products are good for Anda and the reps due to good margins or commissions, it will have a higher markup.  Markup is reduced for items',
                        //columnGroupShow: 'open', pinned: true
                    },
                    {
                        headerName: "Score", field: "score_raw",
                        width: 110, sort: "desc",
			headerTooltip: 'Prob times score markup.  This is the final value on the basis of which rows are sorted.',
                        // pinned: true,
                        suppressFilter: true
                    },
                    {
                        headerName: "Features", field: "features_raw",
                        width: 150, columnGroupShow: 'open',
			hide: true
                        // pinned: true,
                    },
                    {
                        headerName: "Selected", field: "selected",
                        width: 150, columnGroupShow: 'open',
                        hide: true
                        // pinned: true,
                    },
                    {
                        headerName: "Pitched", field: "pitched",
                        width: 150, columnGroupShow: 'open',
                        hide: true
                        // pinned: true,
                    },
		    /*		    
                    {
                        headerName: "Country", field: "country", width: 150,
                        cellRenderer: countryCellRenderer, pinned: true,
                        filterParams: {cellRenderer: countryCellRenderer, cellHeight: 20}, columnGroupShow: 'open'
                    },
		    */
		    /*
                    {
                        headerName: "DOB", field: "dob", width: 120, pinned: true, cellRenderer: function(params) {
                        return  pad(params.value.getDate(), 2) + '/' +
                            pad(params.value.getMonth() + 1, 2)+ '/' +
                            params.value.getFullYear();
                        }, filter: 'date', columnGroupShow: 'open'
                    },
                    {
                        headerName: "Category", field: "category", width: 150,
                        // cellRenderer: categoryCellRenderer, pinned: true,
                        // filterParams: {cellRenderer: categoryCellRenderer, cellHeight: 20},
			pinned: true, columnGroupShow: 'open'
                    },
		    */
                    {
                        headerName: "Score", field: "score",
                        width: 150, columnGroupShow: 'open',
                        cellRenderer: percentCellRenderer,
                        filter: ScoreFilter,
			hide: true,
                        // columnGroupShow: 'open',
                        suppressFilter: true
                    },
                ]
            },
	    /*
            {
                headerName: 'Contact',
                children: [
                    {headerName: "Mobile", field: "mobile", width: 150, filter: 'text'},
                    {headerName: "Land-line", field: "landline", width: 150, filter: 'text'},
                    {headerName: "Address", field: "address", width: 500, filter: 'text'}
                ]
            }
	    */
        ];
    }

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            var model = this.gridOptions.api.getModel();
            var totalRows = this.rowData.length;
            var processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    private onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    }

    public onGridReady(params) {
        this.gridOptions.api.closeToolPanel();
        console.log('onGridReady');
        this.calculateRowCount();
        params.api.forEachNode(function (node) {
            node.setExpanded(node.id === "1");
        });
    }

    private onCellClicked($event) {
        console.log($event);
        console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
        if ($event.colDef.field == "item") {
            $event.node.setExpanded(!$event.node.expanded)
        }
        if ($event.colDef.field == "gppc" || $event.colDef.field == "category" || $event.colDef.field == "gpid") {
            console.log('Update universal filter');
            console.log($event.value);
            var clickedText = $event.value.trim()
            if (this.quickFilterText.includes(clickedText)) {
                console.log(clickedText + ' found');
                console.log(this.quickFilterText)
                this.quickFilterText = this.quickFilterText.replace(clickedText, '');
                console.log(this.quickFilterText)
            }
            else {
                console.log(clickedText + ' not found so adding');
                this.quickFilterText += ' ' + clickedText;
            }
            this.gridOptions.api.setQuickFilter(this.quickFilterText);
        }

        if ($event.colDef.field == "happy") {
            console.log('Update Mood');
            console.log($event.node.data.happy);
            $event.node.data.happy = !$event.node.data.happy;
            console.log($event.node.data.happy);
            this.feedback[$event.node.data.item] = $event.node.data;
	    this.gridOptions.api.redrawRows($event);
        }
        if ($event.colDef.field == "sad") {
            console.log('Update Mood');
            console.log($event.node.data.sad);
            $event.node.data.sad = !$event.node.data.sad;
            console.log($event.node.data.sad);
            this.feedback[$event.node.data.item] = $event.node.data;
	    this.gridOptions.api.redrawRows($event);
        }
    }

    private onCellValueChanged($event) {
        console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
    }

    private onCellDoubleClicked($event) {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
        $event.node.data.pitched = !$event.node.data.pitched;
        // this.gridOptions.api.onFilterChanged();  To enable hiding
        console.log($event.node.data);
        this.feedback[$event.node.data.item] = $event.node.data;
        console.log(this.feedback);
	this.gridOptions.api.redrawRows($event);
    }

    private onCellContextMenu($event) {
        console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellFocused($event) {
        console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
    }

    private onRowSelected($event) {
        // taking out, as when we 'select all', it prints to much to the console!!
        console.log('onRowSelected: ROW[' + $event.rowIndex + ']');
        console.log($event);
        if ($event.node.data.selected == '')
            $event.node.data.selected = 'selected';
        else
            $event.node.data.selected = '';

        console.log('onRowSelected: ' + $event.node.data.selected);
    }

    private onSelectionChanged() {
        console.log('selectionChanged');
    }

    private onBeforeFilterChanged() {
        console.log('beforeFilterChanged');
    }

    private onAfterFilterChanged() {
        console.log('afterFilterChanged');
    }

    private onFilterModified() {
        console.log('onFilterModified');
    }

    private onBeforeSortChanged() {
        console.log('onBeforeSortChanged');
    }

    private onAfterSortChanged() {
        console.log('onAfterSortChanged');
    }

    private onVirtualRowRemoved($event) {
        // because this event gets fired LOTS of times, we don't print it to the
        // console. if you want to see it, just uncomment out this line
        // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
    }

    private onRowClicked($event) {
        console.log('onRowClicked: ' + $event.node.data.name);
    }

    public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event) {
        console.log('onColumnEvent: ' + $event);
    }

    //

    onFilterChanged(value) {
        console.log(value);
    }

    currencyFormatter(params) {
        return '\xA3' + params.value;
    }

    onExport() {
        var params = {};
        this.agGrid.api.exportDataAsCsv(params);
    }

    getSelectedRows() {
        const selectedNodes = this.agGrid.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        //this.entityService.setProducts(selectedData) FIXME
        console.log('Selected Data:' + JSON.stringify(selectedData));
    }

    submitSelectedRows() {
        const params = {
            response: true,
            body: {
                // id: this.entityService.getCustomer() + '_' + JSON.stringify(new Date()).replace('"', '').replace('Z"', ''),
		type: 'feeback',
		date: JSON.stringify(new Date()).replace('"', '').replace('Z"', '').substring(0,10),
                // user: this.entityService.getUserName(),
                json: JSON.stringify(this.feedback),
                experience: this.experience,
                comments: this.comments,
            }
        }
        console.log('submitSelectedRows()|Logging:' + JSON.stringify(params.body));

        /*
        const params = {
            response: true,
            body: {
                id: 'item_master.json'
                json: JSON.stringify(this.entityService.static_data),
            }
        }
        console.log(params);
        console.log(JSON.stringify(params.body));
        */
        this.snackBar.open('Thanks for the feeback! 🙂', '', {
            duration: 5000
        });
        /*
        API.put('upsellapi', '/products', params).then(response => {
            // Add your code here
            console.log('Just PUT data');
            //alert('Thanks for submitting the feedback');
            //debugger;
            this.experience = 'None';
            this.comments = '';
        }).catch(error => {
            console.log(error.response)
            alert('Oops! There was a problem');
            //debugger;
        });
        */
    }
}

function featuresCellRenderer(params) {
    var data = params.data;
    var features = [];
    RefData.IT_FEATURES.forEach(function (feature) {
        if (data && data.features && data.features[feature]) {
            //features.push('<img src="src/app/images/features/' + feature + '.png" width="16px" title="' + feature + '" />');
            //features.push('<img src="src/app/images/features/' + feature + '.png" width="10px" title="' + feature + '" />');
            features.push(RefData.IT_FEATURES_IMAGE[feature])
        }
    });
    return features.join(' ');
}

function happyCellRenderer(params) {
    // return '<div style="color:red; font-size: 20px;">' + (params.data.happy? '🙂H': '🙁S') + '</div>'
    return '<i class="fa fa-smile-o fa-w-16 fa-2x" style="align:center; color:' + (params.data.happy? '#189D0E': '#a8a8a8') + '"></i>';
    var data = params.data;
    if (data && data.happy) {
        //        return '<i class="fa fa-smile-o fa-w-16 fa-2x" style="align:center; color:#C0E48E;"></i>';
        // return '<input type="checkbox" data-toggle="toggle" data-on="Enabled" data-off="Disabled" style="align: center;">'
        return '<input type="checkbox" name="happy" value="true" checked>'
    }
    else {
        //        return '<i class="fa fa-smile-o fa-w-16 fa-2x" style="align:center; color:#FEBE89;"></i>';
        // return '<input type="checkbox" data-toggle="toggle" data-on="🙂" data-off="🙁" style="align: center;">'
        //return '<span class="emoji-toggle emoji-happy"><input type="checkbox" id="toggle1" class="toggle"><span class="emoji"></span><label for="toggle1" class="well"></label></span>';	
        return '<input type="checkbox" name="happy" value="false">'
    }
}

function sadCellRenderer(params) {
    return '<i class="fa fa-frown-o fa-w-16 fa-2x" style="align:center; color:' + (params.data.sad? '#F47A7A': '#a8a8a8') + '"></i>';
    var data = params.data;
    if (data && data.sad) {
        //        return '<i class="fa fa-frown-o fa-w-16 fa-2x" style="align:center; color:#C0E48E;"></i>';
        return '<input type="checkbox" name="sad" value="true" checked>'
    }
    else {
        //        return '<i class="fa fa-frown-o fa-w-16 fa-2x" style="align:center; color:#FEBE89;"></i>';
        return '<input type="checkbox" name="sad" value="false">'
    }
}

function countryCellRenderer(params) {
    var flag = "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='src/app/images/flags/" + RefData.COUNTRY_CODES[params.value] + ".png'>";
    return flag + " " + params.value;
}

function createRandomPhoneNumber() {
    var result = '+';
    for (var i = 0; i < 12; i++) {
        result += Math.round(Math.random() * 10);
        if (i === 2 || i === 5 || i === 8) {
            result += ' ';
        }
    }
    return result;
}

function percentCellRenderer(params) {
    var value = params.value;

    var eDivPercentBar = document.createElement('div');
    eDivPercentBar.className = 'div-percent-bar';
    eDivPercentBar.style.width = value + '%';
    if (value < 20) {
        eDivPercentBar.style.backgroundColor = 'red';
    } else if (value < 60) {
        eDivPercentBar.style.backgroundColor = '#ff9900';
    } else {
        eDivPercentBar.style.backgroundColor = '#00A000';
    }

    var eValue = document.createElement('div');
    eValue.className = 'div-percent-value';
    eValue.innerHTML = value + '%';

    var eOuterDiv = document.createElement('div');
    eOuterDiv.className = 'div-outer-div';
    eOuterDiv.appendChild(eValue);
    eOuterDiv.appendChild(eDivPercentBar);

    return eOuterDiv;
}

//Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
    let asString = num + "";
    while (asString.length < totalStringSize) asString = "0" + asString;
    return asString;
}
