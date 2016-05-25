angular.module('invenioCsl.directives')
  .directive('invenioCslLoading', invenioCslLoading);

/**
 * @ngdoc directive
 * @name invenioCslLoading
 * @description
 *    Invenio CSL Loading directive for indicating loading of something.
 * @namespace invenioCsl.directives
 * @example
 *    Usage:
 *    <invenio-csl-loading
 *     template="TEMPLATE_PATH">
 *    </invenio-csl-loading>
 */
function invenioCslLoading() {

  return {
    restrict: 'AE',
    require: '^invenioCsl',
    scope: false,
    templateUrl: templateUrl,
    link: link,
  };

  /**
   * Choose template for loading indicator
   * @memberof invenioCslLoading
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @example
   *    Minimal template `loading.html` usage
   *    <div ng-show='vm.loading'>Loading...</div>
   */
  function templateUrl(element, attrs) {
    return attrs.template;
  }

  /**
   * Set parent controller in scope.
   * @memberof invenioCslLoading
   * @param {service} scope -  The scope of this element.
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @param {invenioCslController} vm - Invenio CSL controller.
   */
  function link(scope, element, attrs, vm) {
    scope.vm = vm;
  }
}
