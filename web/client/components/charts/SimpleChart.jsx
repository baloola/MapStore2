/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const {Tooltip, Legend} = require('recharts');
import { Scrollbars } from 'react-custom-scrollbars';
import DefaultLegendContent from 'recharts/lib/component/DefaultLegendContent';
const {sameToneRangeColors} = require('../../utils/ColorUtils');
const charts = {
   line: require('./Line'),
   pie: require('./Pie'),
   bar: require('./Bar'),
   gauge: require('./Gauge')
};

const AUTOCOLOR_DEFAULTS = {
    base: 190,
    range: 0,
    s: 0.95,
    v: 0.63
};
/**
 * Wraps common charts into a single component.
 * @param {boolean} isAnimationActive
 * @param {String} [type="line"]                         Type of the chart. One of "line", "pie", "bar", "gauge"
 * @param {Object} [tooltip={}]                          false to disable tooltip. TooltipOptions otherwise
 * @param {Object} [legend={}]                           false to disable legend. Legend options otherwise
 * @param {Object} [autoColorOptions] [description]      Options to generate colors for the chart
 * @param {[type]} props                                 [description]
 */
const SimpleChart = ({type="line", tooltip = {}, legend = {}, autoColorOptions = AUTOCOLOR_DEFAULTS, colorGenerator, ...props} = {}) => {
    const Component = charts[type];

    const defaultColorGenerator = (total, colorOptions = autoColorOptions) => {
        const {base, range, ...opts} = colorOptions;
        return (sameToneRangeColors(base, range, total + 1, opts) || [0]).slice(1);
    };
    const ratio= props.width/props.height

    const scrollableLegend = (props) => {


        return (  props.ChartWidth < 200  && ratio >= 1
        || props.ChartHeight < 200  && ratio < 1 ?
         null:
            <Scrollbars

                autoHeight

            >
                <DefaultLegendContent {...props} />
            </Scrollbars>
        );
    };

    return (<div>
    <Component margin={{top: 5, right: 30, left: 20, bottom: 5}} colorGenerator={colorGenerator || defaultColorGenerator} autoColorOptions={autoColorOptions} {...props} {...{legend, tooltip}}>
      {tooltip !== false ? <Tooltip {...tooltip}/> : null}
      {legend !== false ? charts[type] == charts.pie ? <Legend align="right" layout="vertical" wrapperStyle = { {position: "absolute"}} content={scrollableLegend} {...legend}/> : <Legend {...legend} /> : null}
     </Component>
     </div>
   );
};

module.exports = SimpleChart;
