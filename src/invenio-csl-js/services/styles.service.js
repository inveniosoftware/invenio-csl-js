angular.module('invenioCsl.services')
  .service('Styles', Styles);

Styles.$inject = ['$http', '$q'];

/**
 * @ngdoc service
 * @name Styles
 * @namespace invenioCsl.services
 * @param {service} $http - Angular http requests service.
 * @param {service} $q - Angular promise services.
 * @description
 *     Calls the CSL Styles API
 */
function Styles($http, $q) {
  return {
      get: get
  };

  /////////////

  // Functions

  /**
   * Get all styles from the API
   * @memberof Styles
   * @param {string} endpoint - The endpoint of the Styles API.
   * @returns {service} promise
   */
  function get(endpoint) {
    var deferred = $q.defer();

    function success(response) {
      deferred.resolve(response);
    }

    function error(response) {
      deferred.reject(response);
    }

    $http({
      url: endpoint,
      method: 'GET',
    }).then(success, error);

    return deferred.promise;
  }
}
