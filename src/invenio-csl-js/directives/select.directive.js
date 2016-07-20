angular.module('invenioCsl.directives')
  .directive('invenioCslSelect', invenioCslSelect);

invenioCslSelect.$inject = ['$interpolate', '$templateRequest', '$q', 'Styles'];

/**
 * @ngdoc directive
 * @name invenioCslSelect
 * @description
 *    Invenio CSL Select directive for selecting CSL styles.
 * @namespace invenioCsl.directives
 * @example
 *    Usage:
 *    If you want to predefine the options:
 *    <invenio-csl-select
 *     options='[
 *       { "id": "apa", "value": "American Psychology Association" },
 *       { "id": "nature", "value": "Nature" },
 *       { "id": "aids", "value": "AIDS" }
 *     ]'
 *     template="TEMPLATE_PATH">
 *    </invenio-csl-select>
 *
 *    If you want to use a remote source for the options:
 *    <invenio-csl-select
 *     lazy="true"
 *     remote="http://localhost:5000/csl/styles"
 *     template="TEMPLATE_PATH"
 *     item-template="ITEM_TEMPLATE_PATH">
 *    </invenio-csl-select>
 */
function invenioCslSelect($interpolate, $templateRequest, $q, Styles) {

  return {
    restrict: 'AE',
    require: '^invenioCsl',
    scope: false,
    templateUrl: templateUrl,
    link: link,
  };

  /**
   * Choose template for the select box.
   * @memberof invenioCslSelect
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @example
   *    Minimal template `select.html` usage
   *    <select class="form-control"
   *     ng-model="vm.style"
   *     ng-change="handleSelect()"
   *     ng-options="option.id as option.value for option in options">
   *      <option value="">{{ placeholder }}</option>
   *    </select>
   */
  function templateUrl(element, attrs) {
    return attrs.template;
  }

  /**
   * Load options and setup event broadcasts for the controller.
   * @memberof invenioCslSelect
   * @param {service} scope -  The scope of this element.
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @param {invenioCslController} vm - Invenio CSL controller.
   */
  function link(scope, element, attrs, vm) {
    scope.vm = vm;
    scope.placeholder = attrs.placeholder || 'Select a style...';
    scope.handleSelect = handleSelect;
    scope.initSelect = initSelect;

    init();

    /////////////

    // Functions

    /**
     * Initializes the directive.
     * @memberof link
     * @function init
     */
    function init() {
      if (attrs.lazy) {
        element.find('select').one('focus', initData);
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
      if (attrs.remote) {
        Styles
          .get(attrs.remote)
          .then(function(resp) { scope.initSelect(resp.data); }, stylesFailure);
      } else if (attrs.options) {
        scope.initSelect(JSON.parse(attrs.options || '{}'));
      } else {
        stylesFailure();
      }

      /**
       * Handles styles loading failure.
       * @memberof initData
       * @function stylesFailure
       */
      function stylesFailure(response) {
        scope.$broadcast('invenio.csl.failure',
          {data: vm.errorMessages.stylesError });
      }
    }

    /**
     * Initializes the select component.
     * @memberof link
     * @function initSelect
     * @param {Object} data - The data to initialize the component with.
     */
    function initSelect(data) {

      setItemTemplate(attrs.itemTemplate)
      .then(function(itemTemplate) {
        scope.options = Object.keys(data).map(function(key) {
          return {
            id: key,
            value: data[key],
            // We have an issue here, since there are styles that may have very
            // long names and, thus produce a very wide select/option element.
            // We truncate the strings in order to fix this.
            display: itemTemplate({
              key: trunc(key, 20),
              value: trunc(data[key], 70)
            }),
          };
        });
      });

      /**
       * Set a custom item template if defined.
       * @memberof initSelect
       * @function setItemTemplate
       */
      function setItemTemplate(path) {
        if (path) {
          return $templateRequest(path)
          .then(function(tmpl) {
            return $interpolate(tmpl);
          });
        } else {
          return $q.when($interpolate('[{{key}}] {{value}}'));
        }
      }

      /**
       * Truncates a string to a certain length and if so, appends '...'.
       * @memberof initSelect
       * @function trunc
       */
      function trunc(text, n) {
        return (text.length > n) ? text.substr(0 ,n-1) + '...' : text;
      }
    }

    /**
     * Handles the selection of a style.
     * @memberof link
     * @function handleSelect
     */
    function handleSelect() {
      // vm.style is bound to the ng-model, so the controller can just use it
      scope.$broadcast('invenio.csl.citeproc.request');
    }
  }
}
