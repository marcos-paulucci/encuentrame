import {apiUrl} from '../config/apiProperties'
import SessionService from './SessionService';
import isJSON from '../util/isJSON';

/**
 * Manage base session headers for all services after user has logged in
 */
class Service {

  async sendRequest(url, requestOptions) {
    url = apiUrl + url;
    let userId = await SessionService.getSessionUserId();
    let token = await SessionService.getSessionToken();

    let defaultRequest = {
      method: 'GET',
      headers: Object.assign({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        token && {'token': token},
        userId && {'user': userId}
      )
    };

    if (requestOptions.body) {
      this._ensureBodyStringified(requestOptions);
    }

    if (requestOptions.method === 'POST') {
      this._ensureBodyPresent(requestOptions);
    }


    let request = Object.assign(defaultRequest, requestOptions);

    let rawResponse = await fetch(url, request);
    let responseBody = await this.parseResponse(rawResponse);
    await this.checkResponseStatus(rawResponse, responseBody);
    return responseBody;
  }

  /**
   * Useful to save the need of always stringifying manually the body.
   * @param requestOptions
   * @private
   */
  _ensureBodyStringified = (requestOptions) => {
    try {
      JSON.parse(requestOptions.body);
      // > is stringified. do nothing.
    } catch (e) {
      // > was not. do stringify.
      requestOptions.body = JSON.stringify(requestOptions.body);
    }
  };

  /**
   * Useful when we need at least an empty body
   * @param requestOptions
   * @private
   */
  _ensureBodyPresent = (requestOptions) => {
    if (!requestOptions.body) {
      requestOptions.body = JSON.stringify({});
    }
  };

  async parseResponse(rawResponse) {
    try {
      return await this._parseJSON(rawResponse);
    } catch (e) {
      console.error("Invalid server raw response", e);
      throw 'Ocurrió un problema en la comunicación con el servidor.'
    }
  }


  /**
   * Parse response body to always return a valid JS object,
   * even if body is null or empty ("{}").
   *
   * @param response
   * @returns {Promise.<{}>}
   * @private
   */
  _parseJSON = async (response) => {
    let text = await response.text();
    let parsed = isJSON(text) ? JSON.parse(text) : {};
    return parsed;
  };

  async checkResponseStatus(rawResponse, responseBody) {
    let status = rawResponse.status;
    if (status < 200 || status >= 300) {
      console.log(`Something unexpected did happen (status: ${status}). Raw response: \n`, rawResponse);

      if (status === 403) {
        throw 'El servidor no está disponible. Por favor, vuelva a intentar más tarde :(';
      }

      if (status === 401) {
        let defaultMsg = 'La sesión ha caducado. Por favor, vuelva a iniciar sesión.';
        throw {message: defaultMsg, status, responseBody};
      }

      if (status === 400) {
        let responseJSON = JSON.stringify(responseBody);
        console.log(`Error 400: bad request. Respuesta obtenida: ${responseJSON} `);
        throw {message: 'La solicitud es inválida.', status, responseBody};
      }

      throw 'Ha ocurrido un error. (status: ' + status + ').';

    }
  }
}

let baseService = new Service();
export default baseService;
