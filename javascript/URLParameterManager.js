export default class URLParameterManager {
  getURLParameters() {
    const queryString = window.location.search
    return new URLSearchParams(queryString)
  }

  setURLParameters(parameter) {
    const url = new URL(window.location)
    url.searchParams.set(parameter.name, parameter.value)

    window.history.pushState({}, undefined, url)
  }

  getParameterValue(parameterName) {
    const urlParameters = this.getURLParameters()
    return urlParameters.get(parameterName)
  }
}