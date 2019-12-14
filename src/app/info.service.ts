import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';

import { Headers, Http, RequestOptions, RequestMethod } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: Http) { }

  //url="http://52.78.114.138:8000";
  url="http://localhost:8000";

  login(list){
    //console.log('login')
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/login',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  changePW(list){
    //console.log('login')
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/changePW',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  getTasks(list){
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});
    var body=JSON.stringify(list)

    return this.http.post(this.url+'/getTasks',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  getTask(list){
    //console.log('login')
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/getTask',body,options)
    .pipe(map(data =>{
        //console.log(data)
        return data.json();
    }))
  }
  getSubmited(list){
    //console.log('login')
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/getSubmited',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  compile(list){
    //console.log('//compile');
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/compile',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  submitCode(list){
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/submitCode',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  adminLogin(list){
    //console.log('login')
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/adminLogin',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  getAllTasks(){
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.url+'/getAllTasks',options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
  addTask(list){
    //console.log('login')
    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    var body=JSON.stringify(list)
    return this.http.post(this.url+'/addTask',body,options)
    .pipe(map(data =>{
        return data.json();
    }))
  }
}
