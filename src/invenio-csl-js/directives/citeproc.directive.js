angular.module('invenioCsl.directives')
  .directive('invenioCslCiteproc', invenioCslCiteproc);

/**
 * @ngdoc directive
 * @name invenioCslCiteproc
 * @description
 *    The Invenio CSL Citeproc directive for a citation formatting result.
 * @namespace invenioCsl.directives
 * @example
 *    Usage:
 *    <invenio-csl-citeproc
 *     endpoint="http://localhost:5000/api/records/7564"
 *     template="TEMPLATE_PATH">
 *    </invenio-csl-citeproc>
 */
function invenioCslCiteproc() {

  return {
    restrict: 'AE',
    require: '^invenioCsl',
    scope: false,
    templateUrl: templateUrl,
    link: link,
  };

  /**
   * Choose template for the citation result.
   * @memberof invenioCslCiteproc
   * @param {service} element - Element that this directive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @example
   *    Minimal template `citeproc.html` usage
        <p><i>{{ vm.citationResult }}</i></p>
   */
  function templateUrl(element, attrs) {
    return attrs.template;
  }

  /**
   * Set parent controller in scope and load citeproc endpoint.
   * @memberof invenioCslCiteproc
   * @param {service} scope -  The scope of this element.
   * @param {service} element - Element that this directive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @param {invenioCslController} vm - Invenio CSL controller.
   */
  function link(scope, element, attrs, vm) {
    scope.vm = vm;
    vm.citeprocEndpoint = attrs.endpoint;
  }
}
