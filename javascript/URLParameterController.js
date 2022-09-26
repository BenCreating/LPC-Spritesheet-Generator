/**
 * Manages saving the selected options in the URL and looking up saved data
 */
export default class URLParameterController {
  getURLParameters() {
    const queryString = window.location.search
    return new URLSearchParams(queryString)
  }

  /**
   * Stores the selected option in the URL parameters
   *
   * @param {object} parameter
   * @param {string} parameter.name
   * @param {string} parameter.value
   */
  setURLParameters(parameter) {
    const url = new URL(window.location)
    url.searchParams.set(parameter.name, parameter.value)

    window.history.pushState({}, undefined, url)
  }

  /**
   * Retrieves the value of an option from the URL parameters
   *
   * @param {string} parameterName the key to get the value for
   * @returns {string} the value of the key as a string
   */
  getParameterValue(parameterName) {
    const urlParameters = this.getURLParameters()
    return urlParameters.get(parameterName)
  }
}
