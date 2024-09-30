import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  location: string;
  weatherForm: FormGroup;   // weather Page Form


  constructor(private storage: Storage, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {

    this.weatherForm = this.fb.group({
      location: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z, ]*'),
        Validators.minLength(3),
        Validators.maxLength(20)])]
    });

    this.storage.get('location').then((val) => {
      // console.log(JSON.parse(val));
      if (val != null) {
        this.weatherForm.controls.location.setValue(JSON.parse(val));
      } else {
        this.weatherForm.controls.location.setValue('Monastir');
      }
    });
  }

  saveForm() {
    this.storage.set('location', JSON.stringify(this.weatherForm.value.location));
    this.storage.get('location').then(val => {
      this.router.navigateByUrl('/tabs/home', { queryParams: { location: val }, });
    });
  }
}


