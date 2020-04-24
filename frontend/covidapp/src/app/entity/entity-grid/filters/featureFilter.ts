import RefData from '../data/refData';
import {IFilter,IFilterParams} from "ag-grid-community/main";

var FEATURE_TEMPLATE =
    '<label style="border: 1px solid lightgrey; margin: 4px; padding: 4px; display: inline-block;">' +
    '  <span>' +
    '    <div style="text-align: center;">FEATURE_NAME</div>' +
    '    <div>' +
    '      <input type="checkbox"/>' +
    '      <img src="src/app/images/features/FEATURE.png" width="30px"/>' +
    '    </div>' +
    '  </span>' +
    '</label>';

var FILTER_TITLE =
    '<div style="text-align: center; background: lightgray; width: 100%; display: block; border-bottom: 1px solid grey;">' +
    '<b>TITLE_NAME</b>' +
    '</div>';

export default class FeatureFilter implements IFilter {
    private filterChangedCallback:Function;
    private model:any;

    public init(params: IFilterParams) : void {
        this.filterChangedCallback = params.filterChangedCallback;
        this.model = {
            history: false,
            promo: false,
            suggested: false,
            trending: false,
            caveat: false
        };
    };

    public getGui() {
        var eGui = document.createElement('div');
        eGui.style.width = '380px';
        var eInstructions = document.createElement('div');
        eInstructions.innerHTML = FILTER_TITLE.replace('TITLE_NAME', 'Custom Features Filter');
        eGui.appendChild(eInstructions);

        var that = this;

        RefData.IT_FEATURES.forEach(function (feature, index) {
            var featureName = RefData.IT_FEATURES_NAMES[index];
            var eSpan = document.createElement('span');
            var html = FEATURE_TEMPLATE.replace("FEATURE_NAME", featureName).replace("FEATURE", feature);
            eSpan.innerHTML = html;

            var eCheckbox = <HTMLInputElement> eSpan.querySelector('input');
            eCheckbox.addEventListener('click', function () {
                that.model[feature] = eCheckbox.checked;
                that.filterChangedCallback();
            });

            eGui.appendChild(eSpan);
        });

        return eGui;
    };

    public doesFilterPass(params) {

        var rowFeatures = params.data.features;
        var model = this.model;
        var passed = true;

        RefData.IT_FEATURES.forEach(function (feature) {
            if (model[feature]) {
                if (!rowFeatures[feature]) {
                    passed = false;
                }
            }
        });

        return passed;
    };

    public isFilterActive() {
        var model = this.model;
        var somethingSelected = model.history || model.promo || model.suggested || model.trending || model.caveat;
        return somethingSelected;
    };

    public getModel():any {
        return undefined;
    }

    public setModel(model:any):void {
    }
}

