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

describe('Unit: testing directive invenio-csl-select', function() {

  describe('with local data', function() {
    var $compile;
    var $rootScope;
    var $templateCache;
    var template;
    var scope;

    // Inject the angular module
    beforeEach(angular.mock.module('templates'));

    // Inject the angular module
    beforeEach(angular.mock.module('invenioCsl'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$templateCache_) {
      // Template compiler
      $compile = _$compile_;
      // The Scope
      $rootScope = _$rootScope_;
      // Template cache
      $templateCache = _$templateCache_;

      // Specify select directive with local options
      var options = {
        'apa': 'American Psychology Association',
        'nature-digest': 'Nature Digest',
      };

      $templateCache.put('item.html', '[{{key}}] {{value}}')
      template = '<invenio-csl> ' +
                 '  <invenio-csl-select ' +
                 '   options=\'' + JSON.stringify(options) + '\' ' +
                 '   template="src/invenio-csl-js/directives/select.html" ' +
                 '   item-template="item.html">' +
                 '  </invenio-csl-select>' +
                 '</invenio-csl>';

      scope = $rootScope;
      template = $compile(template)(scope);
      // We don't want to test if the controller's method
      sinon.stub(template.scope().vm, 'formatCitation', function() {});
      scope.$digest();
    }));

    it('should have three options in the select', function() {
      // We have three options: 1 placeholder + 2 styles
      expect(template.find('option').length).to.be.equal(3);
    });

    it('should have short style names as option values', function() {
      expect(template.find('option').eq(1).val()).to.contain('apa');
    });

    it('should have long names as option display text', function() {
      expect(template.find('option').eq(2).text()).to.contain('Nature Digest');
    });

    it('should broadcast an event when selected', function() {
      sinon.spy(template.scope(), '$broadcast');
      template.find('select').eq(0).val('string:apa');
      template.find('select').eq(0).triggerHandler('change');

      expect(template.scope().vm.style).to.contain('apa');
      expect(template.scope().$broadcast.calledWith('invenio.csl.citeproc.request'))
        .to.be.true;
    });
  });

  describe('with remote data', function() {
    var $compile;
    var $httpBackend;
    var $rootScope;
    var template;
    var scope;

    // Inject the angular module
    beforeEach(angular.mock.module('templates'));

      // Inject the angular module
    beforeEach(angular.mock.module('invenioCsl'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
      // Template compiler
      $compile = _$compile_;
      // The Scope
      $rootScope = _$rootScope_;
      // The http backend
      $httpBackend = _$httpBackend_;

      // Specify select directive with local options
      var styles = {
        'allergy': 'Allergy Reports',
        'science': 'Science Magazine',
        'harvard': 'Harvard Review',
      };

      // Expect a request
      $httpBackend.whenGET('/csl/styles').respond(200, styles);

      template = '<invenio-csl> ' +
                 '  <invenio-csl-select ' +
                 '   remote="/csl/styles" ' +
                 '   template="src/invenio-csl-js/directives/select.html">' +
                 '  </invenio-csl-select>' +
                 '</invenio-csl>';

      scope = $rootScope;
      template = $compile(template)(scope);
      scope.$digest();
      $httpBackend.flush();

      // We don't want to test the controller's method
      sinon.stub(template.scope().vm, 'formatCitation', function() {});
    }));

    it('should have four options in the select', function() {
      expect(template.find('select').length).to.be.equal(1);

      // We have three options: 1 placeholder + 3 styles
      expect(template.find('option').length).to.be.equal(4);
    });

    it('should have short style names as option values', function() {
      expect(template.find('option').eq(1).val()).to.contain('allergy');
    });

    it('should have long names as option display text', function() {
      expect(template.find('option').eq(1).text()).to.contain('Allergy Reports');
    });

    it('should broadcast an event when selected', function() {
      sinon.spy(template.scope(), "$broadcast");
      template.find('select').val('string:science').change();

      expect(template.scope().vm.style).to.contain('science');
      expect(template.scope().$broadcast.calledWith('invenio.csl.citeproc.request'))
        .to.be.true;
    });
  });
});
