import { Component, OnInit } from '@angular/core';
import embed from 'vega-embed';
export default embed;


@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        /*
        const oldSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "description": "Simple bar chart",
            "data": {
                "values": [
                    {"x": "A", "y": 28}, {"x": "y", "B": 55}, {"x": "C", "y": 43},
                    {"x": "D", "y": 91}, {"x": "E", "y": 81}, {"x": "F", "y": 53},
                    {"x": "G", "y": 19}, {"x": "H", "y": 87}, {"x": "I", "y": 52}
                ]
            },
            "mark": "bar",
            "encoding": {
                "x": {"field": "x", "type": "ordinal"},
                "y": {"field": "y", "type": "quantitative"}
            }
        };
        embed("#old", oldSpec, { actions: false });

        const spec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.12.2.json',
            description: 'A simple bar chart with embedded data.',
            data: {
                values: [
                    {a: 'A', b: 28},
                    {a: 'B', b: 55},
                    {a: 'C', b: 43},
                    {a: 'D', b: 91},
                    {a: 'E', b: 81},
                    {a: 'F', b: 53},
                    {a: 'G', b: 19},
                    {a: 'H', b: 87},
                    {a: 'I', b: 52}
                ]
            },
            mark: 'bar',
            encoding: {
                x: {field: 'a', type: 'ordinal'},
                y: {field: 'b', type: 'quantitative'}
            }
        };
        */
        const spec_url = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";

        embed("#vis", spec_url);
    }
}
