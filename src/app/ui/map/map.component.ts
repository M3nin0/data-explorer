import { Component, OnInit, Input } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.fullscreen/Control.FullScreen.js';
import 'src/assets/plugins/Leaflet.Coordinates/Leaflet.Coordinates-0.1.5.min.js';
import 'esri-leaflet/dist/esri-leaflet.js';
import * as LE from 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.js';

import { MapOptions, Map as MapLeaflet,
  rectangle, tileLayer, Layer } from 'leaflet';
import { Store, select } from '@ngrx/store';
import * as fromUI from '../ui.reducer';
import { removeLayer, addLayer } from '../ui.action';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit {

   constructor(private store: Store<fromUI.AppState>) {
    this.store.pipe(select('ui')).subscribe(res => {

      //add layer
      if(res['layer'] && res['layer'].layer  && this.map){
        this.map.addLayer(res['layer'].layer)
        this.store.dispatch(addLayer({
          layer: null
      }))
      }

      //remove layer
      if(res['layerToDisabled'] && res['layerToDisabled'].id && this.map){
        this.map.eachLayer( l => {
          if (l['options']['id'] == res['layerToDisabled'].id) {
            this.map.removeLayer(l);
          }
        });
        this.store.dispatch(removeLayer({id: null}))
      } 
      
    })
   }

 public map: MapLeaflet;
 
 public options: MapOptions;
 public layersControl: any;

 ngOnInit() {

  this.baselayers();

 }

 baselayers() {

  this.layersControl = {
    baseLayers: {
      'Google Hybrid':  tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}' , { enebled: true, maxZoom: 18, attribution: '...', subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    },
    overlays: {
     
    }
  }
 
  this.options = 	{ 
    zoom: 4,
    center: [-6, -67],
    layers: [ this.layersControl.baseLayers['Google Hybrid']]
  }

 }

 private setFullscreenControl() {
   (L.control as any).fullscreen({
     position: 'topleft',
     title: 'Show Map Fullscreen',
     titleCancel: 'Exit Fullscreen',
     content: null,
     forceSeparateButton: true
   }).addTo(this.map);
 }

 private setCoordinatesControl() {
   (L.control as any).coordinates({
     position: 'bottomleft',
     decimals: 5,
     decimalSeperator: '.',
     labelTemplateLat: 'Lat: {y}',
     labelTemplateLng: '| Lng: {x}',
     enableUserInput: false,
     useDMS: false,
     useLatLngOrder: true,
   }).addTo(this.map);
 }

 private setGeocoderControl() {
   const searchControl = LE.geosearch().addTo(this.map);
   const vm = this;

   searchControl.on('results', data => {
     vm.map.eachLayer( l => {
       if (l['options'].className === 'previewBbox') {
         vm.map.removeLayer(l);
       }
     });

     for (let i = data.results.length - 1; i >= 0; i--) {
       const newLayer = rectangle(data.results[i].bounds, {
         color: '#CCC',
         weight: 1,
         interactive: false,
         className: 'previewBbox'
       });

       vm.map.addLayer(newLayer);
     }
   });
 }

 public setScaleControl() {
   L.control.scale({
     imperial: false
   }).addTo(this.map);
 }

 onMapReady(map: MapLeaflet) {
   this.map = map;
   this.setFullscreenControl();
   this.setCoordinatesControl();
   this.setGeocoderControl();
   this.setScaleControl();
  }
 
}