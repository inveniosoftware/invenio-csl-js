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

describe('Unit: testing controllers', function() {

  var $controller;
  var $httpBackend;
  var $rootScope;
  var ctrl;
  var scope;

  // Inject the angular module
  beforeEach(angular.mock.module('invenioCsl'));

  beforeEach(angular.mock.module('templates'));

  beforeEach(inject(function(_$httpBackend_, _$rootScope_, _$controller_) {
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $httpBackend.whenGET('/api/1234?locale=en-US&style=apa')
      .respond(200, 'Doe J., Some Sort of Article (2016)');
    $httpBackend.whenGET('/api/error?locale=en-US&style=apa')
      .respond(400, 'error');

    scope = $rootScope;

    ctrl = $controller('invenioCslController', {
      $scope : scope,
    });

    ctrl.style = 'apa';
    ctrl.errorMessages = {
      citeprocError: 'Citeproc error message.',
      stylesError: 'Styles error message.'
    };
  }));

  it('should have parameters', function() {
    expect(ctrl.loading).to.be.equal(false);
    expect(ctrl.locale).to.be.equal('en-US');
  });

  it('should set the citation', function() {
    ctrl.citeprocEndpoint = '/api/1234';
    scope.$broadcast('invenio.csl.citeproc.request');
    $httpBackend.flush();

    // Expect to be the following
    expect(ctrl.citationResult).to.be.equal('Doe J., Some Sort of Article (2016)');
  });

  it('should set the error message', function() {
    ctrl.citeprocEndpoint = '/api/error';
    scope.$broadcast('invenio.csl.citeproc.request');
    $httpBackend.flush();

    // Expect to be the following
    expect(ctrl.error)
      .to.be.equal('Citeproc error message.');
  });
});
