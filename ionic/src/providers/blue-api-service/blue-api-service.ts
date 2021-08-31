import { Injectable } from '@angular/core';

/*
  Generated class for the BlueApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BlueApiServiceProvider {

  public userState = {
    accessToken : null,
    authenticated: false
  };

  constructor() {
  }

  logout() {
    this.userState.accessToken = null;
    this.userState.authenticated = false;
  }
  
  getCatalog(successCallback, errorCallback) {
    var restUrl = 'items';
    var requestType = 'GET';
    var options = {
      timeout : 30000,
      backendServiceName : "catalogService"
    }
    this.invokeService(restUrl, requestType, null, options, successCallback, errorCallback);
  }
  
  getItemById(itemId, successCallback, errorCallback) {
    var restUrl = 'items/' + itemId;
    var requestType = 'GET';
    var options = {
      timeout : 30000,
      backendServiceName : "catalogService"
    }
    this.invokeService(restUrl, requestType, null, options, successCallback, errorCallback);
  }

  getItemReviewById(itemId, successCallback, errorCallback) {
    var restUrl = 'review' + itemId;
    var requestType = 'GET';
    var options = {
      timeout : 30000,
      backendServiceName : "reviewService"
    }
    this.invokeService(restUrl, requestType, null, options, successCallback, errorCallback);
  }

  buyItems(parameters, successCallback, errorCallback) {
    var access_token = this.userState.accessToken;
    var restUrl = 'orders';
    var requestType = 'POST_AUTH';
    var options = {
      timeout : 30000,
      backendServiceName : "ordersService"
    }
    this.invokeService(restUrl, requestType, parameters, options, successCallback, errorCallback, access_token);
  }

  addReviewItem(access_token, itemId, parameters, successCallback, errorCallback) {
    var restUrl = 'review' + itemId;
    var requestType = 'POST_AUTH';
    var options = {
      timeout : 30000,
      backendServiceName : "reviewService"
    }
    this.invokeService(restUrl, requestType, parameters, options, successCallback, errorCallback, access_token);
  }

  getCustomerProfile(successCallback, errorCallback) {
    var access_token = this.userState.accessToken;
    var restUrl = 'customer';
    var requestType = 'GET_AUTH';
    var options = {
      timeout : 30000,
      backendServiceName : "customerService"
    }
    this.invokeService(restUrl, requestType, null, options, successCallback, errorCallback, access_token);
  }

  getCustomerOrders(successCallback, errorCallback) {
    var access_token = this.userState.accessToken;
    var restUrl = 'orders';
    var requestType = 'GET_AUTH';
    var options = {
      timeout : 30000,
      backendServiceName : "ordersService"
    }
    this.invokeService(restUrl, requestType, null, options, successCallback, errorCallback, access_token);
  }


  private invokeService(restUrl, requestType, parameters, options, successCallback, errorCallback, access_token?) {
    var resourceRequest: WLResourceRequest;
    if (requestType == 'GET') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.GET, options);
      resourceRequest.send().then(successCallback, errorCallback);
    }
    else if (requestType == 'GET_AUTH') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.GET, options);
      resourceRequest.addHeader("ext-token", 'Bearer ' + access_token);
      resourceRequest.send().then(successCallback, errorCallback);
    }
    else if (requestType == 'DELETE') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.DELETE, options);
      resourceRequest.send().then(successCallback, errorCallback);
    } else if (requestType == 'POST_AUTH') {
      resourceRequest = new WLResourceRequest(restUrl, WLResourceRequest.POST, options);
      resourceRequest.addHeader("ext-token", 'Bearer ' + access_token);
      resourceRequest.send(parameters).then(successCallback, errorCallback);
    } else {
      errorCallback("Invalid Request");
    }
  }



}
