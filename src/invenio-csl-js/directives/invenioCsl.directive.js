angular.module('invenioCsl.directives')
  .directive('invenioCsl', invenioCsl);

/**
 * @ngdoc directive
 * @name invenioCsl
 * @description
 *    Invenio CSL parent container directive.
 * @namespace invenioCsl.directives
 * @example
 *    Usage:
 *    <invenio-csl
 *     citeproc-error="This citation could not be rendered."
 *     styles-error="CSL Styles could not be loaded."
 *     default-error="Unfortunately an error occured while processing your request.">
 *      ... Any children directives
 *    </invenio-csl>
 */
function invenioCsl() {

  return {
    restrict: 'AE',
    scope: true,
    controller: 'invenioCslController',
    controllerAs: 'vm',
    link: link,
  };

  /**
   * Broadcast initialization event.
   * @memberof invenioCslTypeahead
   * @param {service} scope -  The scope of this element.
   * @param {service} element - Element that this direcive is assigned to.
   * @param {service} attrs - Attribute of this element.
   * @param {invenioCslController} vm - Invenio CSL controller.
   */
  function link(scope, element, attrs, vm) {
    // Broadcast initialization
    scope.$broadcast('invenio.csl.initialization');

    // Get options from directive attributes
    vm.locale = attrs.locale || 'en-US';
    vm.errorMessages = {
      citeprocError: (attrs.citeprocError ||
        'Unfortunately this citation style could not be rendered.'),
      stylesError: (attrs.stylesError ||
        'Unfortunately CSL Styles could not be loaded.'),
      defaultError: 'Unfortunately an error occured while processing your request.'
    };
  }
}
