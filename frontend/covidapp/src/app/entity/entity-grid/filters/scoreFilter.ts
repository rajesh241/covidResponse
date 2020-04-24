import {IFilter,IFilterParams} from "ag-grid-community/main";

var FILTER_TITLE =
    '<div style="text-align: center; background: lightgray; width: 100%; display: block; border-bottom: 1px solid grey;">' +
    '<b>TITLE_NAME</b>' +
    '</div>';

var SCORE_TEMPLATE =
    '<label style="padding-left: 4px;">' +
    '<input type="radio" name="RANDOM"/>' +
    'SCORE_NAME' +
    '</label>';

var SCORE_NONE = 'none';
var SCORE_ABOVE40 = 'above40';
var SCORE_ABOVE60 = 'above60';
var SCORE_ABOVE80 = 'above80';

var SCORE_NAMES = ['No Filter', 'Above 40%', 'Above 60%', 'Above 80%'];
var SCORE_VALUES = [SCORE_NONE, SCORE_ABOVE40, SCORE_ABOVE60, SCORE_ABOVE80];

export default class ScoreFilter implements IFilter {
    private filterChangedCallback:Function;
    private selected:string;
    private valueGetter:Function;

    public init(params: IFilterParams) : void {
        this.filterChangedCallback = params.filterChangedCallback;
        this.selected = SCORE_NONE;
        this.valueGetter = params.valueGetter;
    }

    public getGui() {
        var eGui = document.createElement('div');
        var eInstructions = document.createElement('div');
        eInstructions.innerHTML = FILTER_TITLE.replace('TITLE_NAME', 'Custom Score Filter');
        eGui.appendChild(eInstructions);

        var random = '' + Math.random();

        var that = this;
        SCORE_NAMES.forEach(function (name, index) {
            var eFilter = document.createElement('div');
            var html = SCORE_TEMPLATE.replace('SCORE_NAME', name).replace('RANDOM', random);
            eFilter.innerHTML = html;
            var eRadio = <HTMLInputElement> eFilter.querySelector('input');
            if (index === 0) {
                eRadio.checked = true;
            }
            eGui.appendChild(eFilter);

            eRadio.addEventListener('click', function () {
                that.selected = SCORE_VALUES[index];
                that.filterChangedCallback();
            });
        });

        return eGui;
    }

    public doesFilterPass(params) {

        var value = this.valueGetter(params);
        var valueAsNumber = parseFloat(value);

        switch (this.selected) {
            case SCORE_ABOVE40 :
                return valueAsNumber >= 40;
            case SCORE_ABOVE60 :
                return valueAsNumber >= 60;
            case SCORE_ABOVE80 :
                return valueAsNumber >= 80;
            default :
                return true;
        }

    }

    public isFilterActive() {
        return this.selected !== SCORE_NONE;
    }

    public getModel():any {
        return undefined;
    }

    public setModel(model:any):void {
    }
}
