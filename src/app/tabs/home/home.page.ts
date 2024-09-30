import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { Storage } from '@ionic/storage';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Place } from 'src/app/models/place';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  weatherForm: FormGroup;   // weather Page Form
  currentWeather: any;      // store the data comes form darksky API
  weatherResult: boolean;
  geometry: Place;
  icon: string;
  color: string;

  constructor(
    private weatherService: WeatherService,
    private storage: Storage,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
  }
  ngOnDestroy(): void {
    this.currentWeather = {};

  }
  initialize() {
    this.geometry = new Place('', '');
    this.weatherForm = this.fb.group({
      location: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z, ]*'),
        Validators.minLength(3),
        Validators.maxLength(20)])]
    });
    this.currentWeather = {};
    this.weatherResult = false;
  }

  ngOnInit() {

    this.initialize();

    this.activatedRoute.queryParams.subscribe((parmas) => {
      if (parmas.loaction !== undefined) {
        this.weatherForm.controls.location.setValue(parmas.location);
        this.getWeather(this.weatherForm);
      } else {
        this.storage.get('location').then((val) => {
          if (val != null) {
            // console.log(val);
            this.weatherForm.controls.location.setValue(JSON.parse(val));
          } else {
            this.weatherForm.controls.location.setValue('Monastir');
          }
          this.getWeather(this.weatherForm);
        });

      }
    });
  }


  getWeather(fg: FormGroup) {
    // convert location to lat & lng ==> Gecoding using opencage API
    this.weatherService.getGeomentry(fg.controls.location.value).subscribe((data: any) => {
      // console.log(data['results'][0].geometry);
      this.geometry.latitude = data.results[0].geometry.lat;
      this.geometry.longitude = data.results[0].geometry.lng;
      this.weatherService.getCurrentWeather(this.geometry.longitude, this.geometry.latitude).subscribe((weatherData: any) => {
        this.currentWeather = weatherData.currently;  // the currently weather data from darksky API
        // console.log("currentWeather : ", this.currentWeather);
        this.weatherResult = true;
        if (String(this.currentWeather.summary).toLowerCase().indexOf('cloudy') > 0) {
          this.icon = 'cloudy-outline';
          this.color = 'light';
        } else if (String(this.currentWeather.summary).toLowerCase().indexOf('rainy') > 0) {
          this.icon = 'rainy-outline';
          this.color = 'medium';
        } else if (String(this.currentWeather.summary).toLowerCase().indexOf('clear') > 0) {
          this.icon = 'partly-sunny-outline';
          this.color = 'warning';
        } else if (String(this.currentWeather.summary).toLowerCase().indexOf('sunny') > 0) {
          this.icon = 'sunny-outline';
          this.color = 'warning';

        } else if (String(this.currentWeather.summary).toLowerCase().indexOf('thunderstorm') > 0) {
          this.icon = 'thunderstorm-outline';
          this.color = 'dark';
        }

      });
      console.log('icon', this.icon);
    });

  }
}
