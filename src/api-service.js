const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor (endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get tripPoints () {
    return this.#load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this.#load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this.#load({url: 'offers'}).then(ApiService.parseResponse);
  }

  updateTripPoint = async (tripPoint) => {
    const response = await this.#load({
      url: `points/${tripPoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addTripPoint = async (tripPoint) => {
    const response = await this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteTripPoint = async (tripPoint) => {
    const response = await this.#load({
      url: `points/${tripPoint.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({url, method = Method.GET, body = null, headers = new Headers()}) => {
    headers.append('Authorization', this.#authorization);
    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (error) {
      ApiService.catchError(error);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (error) => {
    throw error;
  }

  #adaptToServer = (tripPoints) => {
    const adaptedTripPoints = {
      ...tripPoints,
      'date_from': tripPoints.timeStart.toISOString(),
      'date_to': tripPoints.timeEnd.toISOString(),
      destination: {
        name: tripPoints.destination,
        description: tripPoints.info.description,
        pictures: tripPoints.info.photos,
      },
      'base_price': +tripPoints.price,
      'is_favorite': tripPoints.isFavorite,
    };

    // Ненужные ключи мы удаляем
    delete adaptedTripPoints['timeStart'];
    delete adaptedTripPoints['timeEnd'];
    delete adaptedTripPoints['info'];
    delete adaptedTripPoints['price'];
    delete adaptedTripPoints['isFavorite'];

    return adaptedTripPoints;
  }
}
