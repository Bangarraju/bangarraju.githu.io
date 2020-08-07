import axios from 'axios';

class Service {
  constructor() {
    let service = axios.create({
      baseURL:"http://localhost:3000/"
    });
    this.service = service;
  }
  
  get(path, callback) {
    return this.service.get(path).then(
      (response) => callback(response.status, response.data)
    );
  }

  sendRequest(path, method, payload, callback) {
    return this.service.request({
      method: method,
      url: path,
      responseType: 'json',
      data: payload
    }).then((response) => callback(response.status, response.data));
  }

}

export default new Service;
