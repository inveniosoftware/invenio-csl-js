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

describe('Unit: testing directive invenio-csl-typeahead', function() {

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

      var options = {
        'apa': 'American Psychology Association',
        'nature-digest': 'Nature Digest'
      };

      $templateCache.put('item.html', '<div>[{{id}}] {{value}}</div>');
      template = '<invenio-csl> ' +
                 '  <invenio-csl-typeahead ' +
                 '   placeholder="Select a style..." ' +
                 '   options=\'' + JSON.stringify(options) + '\' ' +
                 '   template="src/invenio-csl-js/directives/typeahead.html" ' +
                 '   item-template="item.html">' +
                 '  </invenio-csl-typeahead>' +
                 '</invenio-csl>';


      scope = $rootScope;
      template = $compile(template)(scope);
      scope.$digest();
    }));


    it('should have a placeholder set', function() {
      expect(template.find('input').eq(1))
        .to.have.attr('placeholder', 'Select a style...');
    });

    it('should have two options loaded with formatted descriptions', function() {
      template.find('input').eq(1).triggerHandler('focus');
      var options = template.find('div').eq(0).children().eq(0).children();

      expect(options.length).to.be.equal(2);

      expect(options.eq(0).text())
        .to.contain('[apa] American Psychology Association');
    });

    it('should filter options on input', function() {
      template.find('input').eq(1).triggerHandler('focus');
      template.find('input').eq(1).val('a').triggerHandler('input');

      var options = template.find('div').eq(0).children().eq(0).children();
      expect(options.length).to.be.equal(1);
    });

    it('should broadcast an event when selected', function() {
      sinon.spy(template.scope(), '$broadcast');
      template.find('input').eq(1).triggerHandler('focus');
      var options = template.find('div').eq(0).children().eq(0).children();
      options.eq(0).click();

      expect(template.scope().$broadcast.calledWith('invenio.csl.citeproc.request'))
        .to.be.equal(true);
    });
  });


  describe('with remote data', function() {
    var $compile;
    var $rootScope;
    var $httpBackend;
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
      // // The http backend
      $httpBackend = _$httpBackend_;

      var styles = {
        'allergy': 'Allergy Reports',
        'science': 'Science Magazine'
      };

      window.localStorage.clear();
      // Expect a request
      $httpBackend.whenGET('/csl/styles').respond(200, styles);

      template = '<invenio-csl> ' +
                 '  <invenio-csl-typeahead ' +
                 '   placeholder="Start typing a style..." ' +
                 '   remote="/csl/styles" ' +
                 '   template="src/invenio-csl-js/directives/typeahead.html"> ' +
                 '  </invenio-csl-typeahead>' +
                 '</invenio-csl>';
      scope = $rootScope;
      template = $compile(template)(scope);
      scope.$digest();
      $httpBackend.flush();
      scope.$digest();
    }));

    it('should have a placeholder set', function() {
      expect(template.find('input').eq(1))
        .to.have.attr('placeholder', 'Start typing a style...');
     });

    it('should have two options loaded with formatted descriptions', function() {
      template.find('input').eq(1).triggerHandler('focus');
      var options = template.find('div').eq(0).children().eq(0).children();

      expect(options.length).to.be.equal(2);
      expect(options.eq(0).text())
        .to.contain('Allergy Reports');
    });

    it('should filter options on input', function() {
      template.find('input').eq(1).val('a').triggerHandler('input');

      var options = template.find('div').eq(0).children().eq(0).children();
      expect(options.length).to.be.equal(1);
    });

    it('should broadcast an event when selected', function() {
      sinon.spy(template.scope(), '$broadcast');
      template.find('input').eq(1).triggerHandler('focus');
      var options = template.find('div').eq(0).children().eq(0).children();
      options.eq(0).click();

      expect(template.scope().$broadcast.calledWith('invenio.csl.citeproc.request'))
        .to.be.equal(true);
    });
  });
});
