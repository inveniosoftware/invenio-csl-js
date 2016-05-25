/*
 * This file is part of Invenio.
 * Copyright (C) 2016 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

'use strict';

describe('Unit: testing directive invenio-csl-error', function() {

  var $compile;
  var $rootScope;
  var template;
  var scope;

  // Inject the angular module
  beforeEach(angular.mock.module('templates'));

  // Inject the angular module
  beforeEach(angular.mock.module('invenioCsl'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    // Template compiler
    $compile = _$compile_;
    // The Scope
    $rootScope = _$rootScope_;

    template = '<invenio-csl> ' +
               '  <invenio-csl-error ' +
               '   template="src/invenio-csl-js/directives/error.html">' +
               '  </invenio-csl-error>' +
               '</invenio-csl>';

    scope = $rootScope;
    template = $compile(template)(scope);
    scope.$digest();
  }));

  it('should be hidden when error is falsy', function() {
    template.scope().vm.error = '';
    expect(template.find('div').eq(0).attr('class')).to.be.equals('ng-hide');
  });

  it('should display the error when set', function() {
    template.scope().vm.error = 'Some error';
    scope.$digest();

    expect(template.find('div').eq(0).attr('class')).to.be.empty;
    expect(template.find('div').eq(0).children().eq(0).text())
      .to.be.equals('Some error');
  });

});
