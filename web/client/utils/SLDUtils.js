/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const assign = require('object-assign');
/*eslint-disable */
const XLink_1_0 = require('w3c-schemas').XLink_1_0;
const {
    WMS_1_3_0,
    SMIL_2_0_Language,
    SMIL_2_0,
    GML_2_1_2,
    GML_3_1_1,
    OWS_1_0_0,
    Filter_1_1_0,
    Filter_1_0_0,
    SE_1_1_0
    } = require("ogc-schemas");

let {SLD_1_0_0} = require("ogc-schemas/lib/SLD_1_0_0_GeoServer");
// Normalize miss vendorOption definition in SLD_1_0_Geoserver ogc schema
SLD_1_0_0.tis[4].ps= [ {
            n: 'vendorOption',
            mno: 0,
            col: true,
            en: 'VendorOption',
            ti: '.VendorOption'}];
const {Jsonix} = require('jsonix');

const context = new Jsonix.Context([
    XLink_1_0,
    WMS_1_3_0,
    OWS_1_0_0,
    SMIL_2_0_Language,
    SMIL_2_0,
    GML_2_1_2,
    GML_3_1_1,
    Filter_1_1_0,
    Filter_1_0_0,
    SE_1_1_0,
    SLD_1_0_0],
    {
        namespacePrefixes: {
        "http://www.opengis.net/ogc": 'ogc',
        "http://www.opengis.net/gml": "gml",
        "http://www.opengis.net/sld": "sld"
        },
        mappingStyle: 'simplified'
});
/*eslint-enable */

const marshall = context.createMarshaller();

const convertOpacity = function(opacity) {
    return {TYPE_NAME: "SLD_1_0_0.ParameterValueType", content: [opacity]};
};
const convertColorMapEntry = function(colorMapEntry) {
    return colorMapEntry.map((entry) => {
        return assign({TYPE_NAME: "SLD_1_0_0.ColorMapEntry"}, entry);
    });
};
const convertColorMap = function(type, extended, colorMapEntry) {

    return {TYPE_NAME: "SLD_1_0_0.ColorMap", type: type, extended: extended, colorMapEntry: convertColorMapEntry(colorMapEntry)};
};
const convertChannel = function(channel) {
    return {TYPE_NAME: "SLD_1_0_0.SelectedChannelType",
                sourceChannelName: channel};
};
const convertVendorOption = function(name, value) {

    return {TYPE_NAME: "SLD_1_0_0.VendorOption", name: name, value: "" + value};
};
const convertAlgorithm = function(bandConfig) {
    return [
            convertVendorOption("algorithm", bandConfig.algorithm),
            convertVendorOption("minValue", bandConfig.min),
            convertVendorOption("maxValue", bandConfig.max)
    ];
};
const convertContrast = function(bandConfig) {
    let c = {TYPE_NAME: "SLD_1_0_0.ContrastEnhancement"};
    switch (bandConfig.contrast) {
        case 'Normalize': {
            c.normalize = {TYPE_NAME: "SLD_1_0_0.Normalize"};
            if (bandConfig.algorithm !== 'none') {
                c.normalize.vendorOption = convertAlgorithm(bandConfig);
            }
            break;
        }
        case 'Histogram': {
            c.histogram = {TYPE_NAME: "SLD_1_0_0.Histogram"};
            break;
        }
        case 'GammaValue': {
            c.gammaValue = bandConfig.gammaValue;
            break;
        }
        default: {
            break;
        }
    }
    return c;
};
const convertOneBandChannel = function(bandConfig, channelType) {
    let cs = {TYPE_NAME: "SLD_1_0_0.ChannelSelection"};
    let channel = convertChannel(bandConfig.band);
    if (bandConfig.contrast !== 'none') {
        channel.contrastEnhancement = convertContrast(bandConfig);
    }
    cs[channelType] = channel;
    return cs;
};
const convertRGBBandChannel = function(redBand, greenBand, blueBand) {
    let red = convertOneBandChannel(redBand, "redChannel");
    let green = convertOneBandChannel(greenBand, "greenChannel");
    let blue = convertOneBandChannel(blueBand, "blueChannel");
    assign(red, green, blue);
    return red;
};

const getSLDObjc = function(layer, rasterSymbolizer) {
        return {
            "sld:StyledLayerDescriptor": {"TYPE_NAME": "SLD_1_0_0.StyledLayerDescriptor", "version": "1.0.0",
                "namedLayerOrUserLayer": [{"TYPE_NAME": "SLD_1_0_0.NamedLayer", "name": layer.name,
                    "namedStyleOrUserStyle": [{"TYPE_NAME": "SLD_1_0_0.UserStyle",
                        "featureTypeStyle": [{"TYPE_NAME": "SLD_1_0_0.FeatureTypeStyle",
                            "rule": [{"TYPE_NAME": "SLD_1_0_0.Rule", "symbolizer": [{"sld:RasterSymbolizer": rasterSymbolizer}]}]}]}]}]}};

    };
const jsonToSLD = function(styletype, opacity, state, layer) {
    let rasterSymbolizer = {TYPE_NAME: "SLD_1_0_0.RasterSymbolizer"};
    rasterSymbolizer.opacity = convertOpacity(opacity);
    switch (styletype) {
        case 'pseudo': {
            rasterSymbolizer.colorMap = convertColorMap(state.pseudocolor.type, state.pseudocolor.extended, state.pseudocolor.colorMapEntry);
            if (state.pseudoband.band !== 'none') {
                rasterSymbolizer.channelSelection = convertOneBandChannel(state.pseudoband, "grayChannel");
            }
            break;
        }
        case 'gray': {
            rasterSymbolizer.channelSelection = convertOneBandChannel(state.grayband, "grayChannel");
            break;
        }
        case 'rgb': {
            rasterSymbolizer.channelSelection = convertRGBBandChannel(state.redband, state.greenband, state.blueband);
            break;
        }
        default: {
            break;
        }
    }
    return marshall.marshalString(getSLDObjc(layer, rasterSymbolizer));
};


module.exports = {
    jsonToSLD: jsonToSLD
};