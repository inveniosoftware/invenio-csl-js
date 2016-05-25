angular.module('invenioCsl.controllers')
  .controller('invenioCslController', invenioCslController);

invenioCslController.$inject = ['$scope', 'Citeproc'];

/**
 * @ngdoc controller
 * @name invenioCslController
 * @namespace invenioCsl.controllers
 * @description
 *    Invenio CSL controller.
 */
function invenioCslController($scope, Citeproc) {

  // Assign controller to `vm`
  var vm = this;

  // Error message and loading flag
  vm.error = '';
  vm.loading = false;

  // Citation style and locale
  vm.style = '';
  vm.locale = 'en-US';

  // Formatted citation
  vm.citationResult = '';

  // Methods
  vm.formatCitation = formatCitation;

  ////////////

  // Functions

  /**
   * Format a citation using a specific CSL style.
   * @memberof invenioCslController
   * @function formatCitation
   */
  function formatCitation() {

    vm.citationResult = '';
    vm.loading = true;
    vm.error = '';

    Citeproc
      .format(vm.citeprocEndpoint, vm.style, vm.locale)
      .then(citeprocSuccess, citeprocFailure)
      .finally(clear);

    /**
     * After a successful citeproc request.
     * @memberof formatCitation
     * @function citeprocSuccess
     * @param {Object} response - The citation formatting request response.
     */
    function citeprocSuccess(response) {
      $scope.$broadcast('invenio.csl.citeproc.success', response);
    }

    /**
     * After a citeproc request failure.
     * @memberof formatCitation
     * @function citeprocFailure
     * @param {Object} response - The citation formatting request response.
     */
    function citeprocFailure(response) {
      $scope.$broadcast(
        'invenio.csl.failure',
        { data: vm.errorMessages.citeprocError });
    }

    /**
     * After a citeproc request finishes.
     * @memberof formatCitation
     * @function clear
     */
    function clear() {
      vm.loading = false;
      $scope.$broadcast('invenio.csl.citeproc.finished');
    }
  }

  /**
   * Handle a citation formatting request.
   * @memberof invenioCslController
   * @function invenioCslRequestHandler
   * @param {Object} evt - The event object.
   */
  function invenioCslRequestHandler(evt) {
    $scope.$broadcast('invenio.csl.citeproc.requested');
    vm.formatCitation();
  }

  /**
   * Handle a citation formatting success.
   * @memberof invenioCslController
   * @function invenioCslSuccessHandler
   * @param {Object} evt - The event object.
   * @param {Object} response - The success response.
   */
  function invenioCslSuccessHandler(evt, response) {
    vm.error = '';
    vm.citationResult = response.data;
  }

  /**
   * Handle a citation formatting failure.
   * @memberof invenioCslController
   * @function invenioCslFailureHandler
   * @param {Object} evt - The event object.
   * @param {Object} response - The success response.
   */
  function invenioCslFailureHandler(evt, response) {
    vm.error = response.data;
  }

  ////////////

  // Listeners

  // When a ciation formatting is requested
  $scope.$on('invenio.csl.citeproc.request', invenioCslRequestHandler);
  // When the citation formatting was successful
  $scope.$on('invenio.csl.citeproc.success', invenioCslSuccessHandler);
  // When the citation formatting failed
  $scope.$on('invenio.csl.failure', invenioCslFailureHandler);
}
