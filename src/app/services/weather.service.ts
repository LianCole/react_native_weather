import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../models/place';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // alternative for google
  opencagedataURL: string;

  forecastURl: string;
  location: Place[];
  weatherURL: string;

  constructor(private http: HttpClient) {

    this.opencagedataURL = `https://api.opencagedata.com/geocode/v1/json?q=`;
    this.forecastURl = `https://api.forecast.io/forecast/${environment.darkskyAPI}/`;
    this.weatherURL = this.forecastURl;

  }

  // from darksku.net
  getCurrentWeather(longitude: string, latitiude: string): Observable<object> {
    // console.log(this.http.request("GET", this.weatherURL + longitude + "," + latitiude))
    return this.http.jsonp(this.weatherURL + latitiude + ',' + longitude, 'callback');
  }

  getGeomentry(location: string) {
    console.log(`${this.opencagedataURL}${location}&key=${environment.opencagedataAPI}`);
    return this.http.get(`${this.opencagedataURL}${location}&key=${environment.opencagedataAPI}`);

  }
}
