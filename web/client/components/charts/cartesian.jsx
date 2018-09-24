 /*
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */


const React = require('react');
const{ isString, isNumber, truncate, round} = require('lodash');
const { XAxis, YAxis, CartesianGrid, Text} = require('recharts');

const shorten = (num)=> {
    let unit;
    let number = round(num);
    let add = number.toString().length % 3;

    if (number >= 10000) {

        let trimedDigits = number.toString().length - ( add === 0 ? add + 3 : add );
        let zeroNumber = (trimedDigits) / 3;
        let trimedNumber = number / Math.pow(10, trimedDigits);

        switch (zeroNumber) {
            case 1 :
                unit = ' K';
                break;
            case 2 :
                unit = ' M';
                break;
            case 3 :
                unit = ' B';
                break;
            case 4 :
                unit = ' T';
                break;
            default:
                unit = '';
        }

        number = round(trimedNumber) + unit;
    }else {
        number = round(num, Math.abs(4 - number.toString().length));
    }

    return number;
};

const customize = (label)=>(
    isString(label) ? truncate(label, {'length': 7}) :
    isNumber(label) && label.toString().length < 7 ?
    label : shorten(label)


);

const CustomizedTick = ({x, y, height, width, payload}) => (
    <Text style={{fill: '#666'}} x={height === 60 ? x : x - width / 3} y={height === 60 ? y + height / 2 : y} angle ={height === 60 ? -45 : 0} textAnchor="middle" >
    {customize(payload.value)}
    </Text> );

const renderCartesianTools = ({xAxis, yAxis, cartesian}) => ([
    xAxis && xAxis.show !== false ? <XAxis key="xaxis" tick={<CustomizedTick/>} height={60} minTickGap={0}{...xAxis}/> : null,
    yAxis ? <YAxis key="yaxis" tick={<CustomizedTick/>} {...yAxis}/> : null,
    cartesian !== false ? <CartesianGrid key="cartesiangrid" {...cartesian}/> : null]);
module.exports = {renderCartesianTools};
