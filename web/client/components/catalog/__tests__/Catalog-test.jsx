 /**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const ReactDOM = require('react-dom');
const Catalog = require('../Catalog');
const expect = require('expect');


describe('Tests for Catalog', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('create catalog', () => {

        const component = ReactDOM.render(<Catalog />, document.getElementById('container'));
        expect(component).toExist();

        const searchButton = document.getElementsByClassName('search-button');
        expect(searchButton).toExist();
    });


});
