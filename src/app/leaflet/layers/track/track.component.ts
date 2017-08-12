import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { LeafletLayersDemoModel } from '../layers-demo.model';

@Component({
  selector: 'leafletTrackDemo',
  templateUrl: './track.component.html',
  //styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  // an example of draw a line (this.track)
  // leaflet L.polyline get array of points and an option object for example
  // l.polyline([[1.0,1,0],[2.0.2.0]],[[3.0, 3.0], [4.0, 4.0]], {color: 'red'}) is draw two lines one is [1.0,1.0],[2.0,2.0] and other with [3.0,3.0],[4.0,4.0]

  //track: L.LatLng[];
  track: any = [
    [[46.51, -121.68],
    [49.77, -123.43],
    [45.04, -118.2],
    [46.04, -119.2],
    [31.04, 119.2]],

    [[46.55, -122.78],
    [49.75, -123.56],
    [45.05, 18.2],
    [46.14, 50.2],
    [31.05, -130.2]]
  ];

  //line: any = L.polyline ([[ 46.7, -121.7 ], [ 46.90, -123.90 ], [ 46.86, -122.78 ]]);
  line: any = L.polyline (this.track, {color: 'red'});  
  line1: any = L.polyline ([[43.55, -12.78], [50.75, -121.53], [45.324, 178.2]], {color: 'green'});  

  //myIcon: any = L.divIcon({className: 'my-div-icon'});
  myIcon: any = L.divIcon();
  theMarker: any = L.marker([46.51, -121.68], {icon: this.myIcon});
  // you can set .my-div-icon styles in CSS
  //L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);

 	constructor() {
    //this.track = [[ 46.7, -121.7 ], [ 46.90, -123.90 ], [ 46.86, -122.78 ]];
    this.line.bindTooltip('Hi There!');
		this.onApply();
	}

  ngOnInit() {
    //this.track = [[ 46.7, -121.7 ], [ 46.90, -121.90 ], [ 46.86, -121.78 ]];
    for (let i of this.track) {
      console.log(i + " name is " + this.line.constructor.name);    
      //this.line.bindTooltip("my tooltip text").openTooltip(); 
    }    
  }

  // Open Street Map and Open Cycle Map definitions
	LAYER_OCM = {
		id: 'opencyclemap',
		name: 'Open Cycle Map',
		enabled: true,
		layer: L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Open Cycle Map'
		})
  };
  
	LAYER_OSM = {
		id: 'openstreetmap',
		name: 'Open Street Map',
		enabled: false,
		layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Open Street Map'
		})
  };
  
  polyline = {
        id: 'polyline',
        name: 'Polyline',
        enabled: true,
        //layer: L.polyline([[ 46.7, -121.7 ], [ 46.90, -121.90 ], [ 46.86, -121.78 ]])
        layer: this.line
    };

  polyline2 = {
        id: 'polyline',
        name: 'Polyline',
        enabled: true,
        //layer: L.polyline([[ 46.7, -121.7 ], [ 46.90, -121.90 ], [ 46.86, -121.78 ]])
        layer: this.line1
    };

	circle = {
		id: 'circle',
		name: 'Circle',
		enabled: true,
		layer: L.circle([ 46.95, -122 ], { radius: 50 })
	};
  
  marker = {
		id: 'marker',
		name: 'Marker',
		enabled: true,
    //layer: L.circle([ 46.95, -122 ], { radius: 50 })
    //layer: L.marker([46.505, -122.57], {icon: this.myIcon})
    layer: this.theMarker
	};

	// Form model object
	model = new LeafletLayersDemoModel(
		[ this.LAYER_OSM, this.LAYER_OCM ],
		this.LAYER_OCM.id,
    [ this.circle, this.polyline, this.polyline2, this.marker ]
	);

	// Values to bind to Leaflet Directive
	layers: L.Layer[];
	layersControl: any;
	options = {
		zoom: 10,
		center: L.latLng([ 46.879966, -121.726909 ])
	};

	onApply() {

		// Get the active base layer
		let baseLayer = this.model.baseLayers.find((l) => { return l.id === this.model.baseLayer; });

		// Get all the active overlay layers
		let newLayers = this.model.overlayLayers
			.filter((l) => { return l.enabled; })
			.map((l) => { return l.layer; });
		newLayers.unshift(baseLayer.layer);

    this.layers = newLayers;
    
		this.layersControl = {
			baseLayers: {
				'Open Street Map': this.LAYER_OSM.layer,
				'Open Cycle Map': this.LAYER_OCM.layer
			},
			overlays: {
				//Circle: this.circle.layer,
			}
		};

		return false;
	}
}
