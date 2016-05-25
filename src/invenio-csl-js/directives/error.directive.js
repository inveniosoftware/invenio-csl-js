angular.module('invenioCsl.directives')
  .directive('invenioCslError', invenioCslError);

/**
 * @ngdoc directive
 * @name invenioCslError
 * @description
 *    Invenio CSL Error directive for error display.
 * @namespace invenioCsl.directives
 * @example
 *    Usage:
 *    <invenio-csl-error
 *     template="TEMPLATE_PATH">
 *    </invenio-csl-error>
 *
 */
function invenioCslError() {

  return {
    restrict: 'AE',
    require: '^invenioCsl',
    scope: false,
    templateUrl: templateUrl,
    link: link,
  };

  /**
   * Choose template for the error display.
   * @memberof invenioCslError
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @example
   *    Minimal template `error.html` usage:
   *    <div ng-show='vm.error'>
   *      <div class="alert alert-danger">{{ vm.error }}</div>
   *    </div>
   */
  function templateUrl(element, attrs) {
    return attrs.template;
  }

  /**
   * Set parent controller in scope.
   * @memberof invenioCslError
   * @param {service} scope -  The scope of this element.
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @param {invenioCslController} vm - Invenio CSL controller.
   */
  function link(scope, element, attrs, vm) {
    scope.vm = vm;
  }
}
