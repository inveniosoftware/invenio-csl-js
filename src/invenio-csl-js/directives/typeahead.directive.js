angular.module('invenioCsl.directives')
  .directive('invenioCslTypeahead', invenioCslTypeahead);

invenioCslTypeahead.$inject = ['Styles'];

/**
 * @ngdoc directive
 * @name invenioCslTypeahead
 * @description
 *    Invenio CSL Typeahead directive for the selection of CSL styles.
 * @namespace invenioCsl.directives
 * @example
 *    Usage:
 *    If you want to predefine the options:
 *    <invenio-csl-typeahead
 *     placeholder='Select a style...'
 *     options='{
 *       "apa": "American Psychology Association",
 *       "nature-digest": "Nature Digest"
 *     }'
 *     template="TEMPLATE_PATH">
 *    </invenio-csl-typeahead>
 *
 *    If you want to use a remote source for the options:
 *    <invenio-csl-typeahead
 *     placeholder='Select a style...'
 *     lazy="true"
 *     remote="http://localhost:5000/csl/styles"
 *     template="TEMPLATE_PATH">
 *    </invenio-csl-typeahead>
 *
 */
function invenioCslTypeahead(Styles) {

  return {
    restrict: 'AE',
    require: '^invenioCsl',
    scope: false,
    templateUrl: templateUrl,
    link: link,
  };

  /**
   * Choose template for the typeahead input.
   * @memberof invenioCslTypeahead
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @example
   *    Minimal template `typeahead.html` usage:
   *    <input type="text" class="form-control" placeholder="{{ placeholder }}">
   */
  function templateUrl(element, attrs) {
    return attrs.template;
  }

  /**
   * Initialize typeahead.js and setup event broadcasts for the controller.
   * @memberof invenioCslTypeahead
   * @param {service} scope -  The scope of this element.
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @param {invenioCslController} vm - Invenio CSL controller.
   */
  function link(scope, element, attrs, vm) {
    scope.vm = vm;

    scope.placeholder = attrs.placeholder || 'Start typing a style...';
    scope.typeahead = element.find('input').eq(0);

    scope.clearInput = clearInput;
    scope.handleSelect = handleSelect;
    scope.initTypeahead = initTypeahead;

    init();

    /////////////

    // Functions

    /**
     * Initializes the directive.
     * @memberof link
     * @function init
     */
    function init() {

      // If lazy, initialize everything on the first focus
      if (attrs.lazy) {
        scope.typeahead.one('focus', initData);
      } else {
        initData();
      }
    }

    /**
     * Initializes the data for the directive.
     * @memberof link
     * @function initData
     */
    function initData() {
      // Remote data
      if (attrs.remote) {
        Styles
          .get(attrs.remote)
          .then(function(resp) { scope.initTypeahead(resp.data); }, failure);
      // Local data
      } else {
        scope.initTypeahead(JSON.parse(attrs.options || '[]'));
      }

      /**
       * Handles styles loading failure.
       * @memberof initData
       * @function stylesFailure
       */
      function failure(response) {
        scope.$broadcast('invenio.csl.failure',
          { data: vm.errorMessages.stylesError });
      }
    }

    /**
     * Initializes the typeahead.js component.
     * @memberof link
     * @function initTypeahead
     * @param {Object} data - The data to initialize the component with.
     */
    function initTypeahead(data) {

      // First we need to initialize the suggestion engine
      var bloodhoundSettings = {
        // In Twitter culture, 'datum' is the singular form of 'data'.
        datumTokenizer: function(datum) {
          return Bloodhound.tokenizers.nonword(datum.value + ' ' + datum.id);
        },
        queryTokenizer: Bloodhound.tokenizers.nonword,
        identify: function(obj) { return obj.id; },
      };

      // Set the data for the suggestion engine
      bloodhoundSettings.local = Object.keys(data).map(function(key) {
        return {
          id: key,
          value: data[key],
          display: '[' + key + '] ' + data[key]
        };
      });
      var engine = new Bloodhound(bloodhoundSettings);

      // Define the dataset typeahead.js will use for suggestions
      var dataset = {
        name: 'csl-styles',
        limit: 100,
        display: 'display',
        source: function(q, sync) {
          // We do this because of an issue typeahead.js has when the input
          // is an empty string, not showing the suggestions.
          if (q === '') {sync(engine.all()); } else {engine.search(q, sync); }
        },
        templates: { empty: '<p class="empty-results">No results...</p>' }
      };

      // Set input settings for typeahead.js
      var typeaheadSettings = {
        minLength: 0,
        highlight: true
      };

      // Initialize typeahead.js
      scope.typeahead.typeahead(typeaheadSettings, dataset);

      // Handle typehead.js events
      scope.typeahead.on('typeahead:select', handleSelect);
      scope.typeahead.on('typeahead:active', clearInput);

      // If we lazy-initialized this, the user has already clicked inside the
      // uninitialized, so we should trigger the suggestions manually.
      if (attrs.lazy) {
        scope.typeahead.focus();
      }
    }

    /**
     * Handle selection of a style.
     * @memberof link
     * @function handleSelect
     */
    function handleSelect(event, suggestion) {
      if (suggestion.id) {
        vm.style = suggestion.id;
        scope.typeahead.blur();
        scope.$broadcast('invenio.csl.citeproc.request');
      }
    }

    /**
     * Clear the input text.
     * @memberof link
     * @function clearInput
     */
    function clearInput(event) {
      scope.typeahead.typeahead('val', '');
    }
  }
}
