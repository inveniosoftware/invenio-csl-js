angular.module('invenioCsl.services')
  .service('Citeproc', Citeproc);

Citeproc.$inject = ['$http', '$q'];

/**
 * @ngdoc service
 * @name Citeproc
 * @namespace invenioCsl.services
 * @param {service} $http - Angular http requests service.
 * @param {service} $q - Angular promise services.
 * @description
 *     Calls the citation formatting API
 */
function Citeproc($http, $q) {
  return {
      format: format
  };

  //////////////

  // Functions

  /**
   * Get a formatted citation from the API
   * @memberof Citeproc
   * @param {string} endpoint - The endpoint of the Citeproc API.
   * @param {string} style - The short name of the style (eg. 'apa')
   * @param {string} locale - The style locale (eg. 'en-US')
   * @returns {service} promise
   */
  function format(endpoint, style, locale) {
    var deferred = $q.defer();

    /**
     * Citeproc on success
     * @memberof format
     * @param {Object} response - The Citeproc API response.
     * @returns {Object} response
     */
    function success(response) {
      deferred.resolve(response);
    }

    /**
     * Citeproc on error
     * @memberof format
     * @param {Object} response - The Citeproc API error response.
     * @returns {Object} response
     */
    function error(response) {
      deferred.reject(response);
    }

    $http({
      url: endpoint,
      method: 'GET',
      headers: {'Accept': 'text/x-bibliography'},
      params: {style: style, locale: locale},
    }).then(success, error);
    return deferred.promise;
  }
}
