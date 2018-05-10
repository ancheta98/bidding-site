import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor(private _http: HttpClient) { }

  postUser(newUser){
    console.log("SERVICE", newUser);
    return this._http.post('/api/newUser', newUser); 

  }

  serviceProducts(){
    return this._http.get('/api/products');
  }
  serviceOneProduct(id){
    return this._http.get('/api/products/'+id)
  }
  serviceBidProduct(id, product){
    return this._http.put('/api/products/'+id, product)
  }
}
