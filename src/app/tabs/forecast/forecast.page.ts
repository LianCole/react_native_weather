import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { Place } from 'src/app/models/place';
import { fahrenheitToCelsius } from 'src/app/utils/fahrenheitToCelsius';
import { WeatherService } from 'src/app/services/weather.service';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

/* declare var require: any;
require('highcharts/highcharts-3d',)(Highcharts);
*/

/*
declare var require: any;
require('highcharts/modules/cylinder')(Highcharts);
*/

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.page.html',
  styleUrls: ['./forecast.page.scss'],
})
export class ForecastPage implements OnInit {


  geometry: Place;
  minWeather: number[];
  maxWeather: number[];
  weatherTime: any;

  dailyChart: Chart;
  hourlyChart: Chart;

  constructor(private storage: Storage, private weatherService: WeatherService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.geometry = new Place('', '');
    this.minWeather = new Array();
    this.maxWeather = new Array();
    this.getForecast();
  }

  prepareData(json, forecastType: 'daily' | 'hourly') {
    this.minWeather = new Array();
    this.maxWeather = new Array();
    this.weatherTime = new Array();
    for (let i = 0; i < json.length; i++) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const b: Date = new Date(json[i].time * 1000);

      if (forecastType === 'daily') {
        this.weatherTime.push(b.getDate() + ' ' + months[b.getMonth()] + ' ' + b.getFullYear()); // x axis: Date

        // y axis: MaxTemp and MinTemp
        this.maxWeather.push(fahrenheitToCelsius(json[i].temperatureMax));
        this.minWeather.push(fahrenheitToCelsius(json[i].temperatureMin));
      } else {
        this.weatherTime.push(b.getDate() + ' ' + months[b.getMonth()] + ' ' + b.getFullYear() + '-' + b.getHours() + ' hours');
        this.minWeather.push(fahrenheitToCelsius(json[i].temperature));
      }
    }
  }


  getForecastHelper(location: string) {

    this.weatherService.getGeomentry(location).subscribe((data: any) => {
      this.geometry.latitude = data.results[0].geometry.lat;
      this.geometry.longitude = data.results[0].geometry.lng;
      this.weatherService.getCurrentWeather(this.geometry.longitude, this.geometry.latitude).subscribe((weatherData: any) => {

        // daily
        this.prepareData(weatherData.daily.data, 'daily');
        this.dailyChart = new Chart({
          title: { text: `Daily Weather Forecast ${location}` },
          chart: { type: 'column' },
          xAxis: { categories: this.weatherTime },
          series: [
            { name: 'Min Temp', data: this.minWeather, type: undefined },
            { name: 'Max Temp', data: this.maxWeather, type: undefined }
          ],
        });

        // hourly
        this.prepareData(weatherData.hourly.data, 'hourly');
        this.hourlyChart = new Chart({
          title: { text: `Hourly Weather Forecast ${location}` },
          chart: { type: 'column' },
          xAxis: {
            categories: this.weatherTime
          },
          series: [
            { name: 'Min Temp', data: this.minWeather, type: undefined },
          ]
        });

      });
    });

  }


  getForecast() {
    this.activatedRoute.queryParams.subscribe((parmas) => {
      if (parmas.loaction !== undefined) {
        this.getForecastHelper(parmas.loaction);
      } else {
        this.storage.get('location').then((val: any) => {
          let location: string;
          if (val != null) {
            location = JSON.parse(val);
            this.getForecastHelper(location);
            // if not find location in storage
          } else {
            this.getForecastHelper('Monastir');
          }

        });
      }
    });
  }
}

