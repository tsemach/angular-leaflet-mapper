# @asymmetrik/angular2-leaflet

[![Build Status][travis-image]][travis-url]

[travis-url]: https://travis-ci.org/Asymmetrik/angular2-leaflet/
[travis-image]: https://travis-ci.org/Asymmetrik/angular2-leaflet.svg


> Leaflet packages for Angular 2. Provides flexible and extensible components for integrating Leaflet v0.7.x and v1.0.x into Angular 2 projects.

> Now supports Angular v4, Ahead-of-Time compilation (AOT), and use in Angular-CLI based projects

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)
- [Credits](#credits)


## Install
Install the package and its peer dependencies via npm:
```
npm install leaflet
npm install @asymmetrik/angular2-leaflet
```

If you intend to use this library in a typescript project (utilizing the typings), you will need to also install the leaflet typings via npm:
```
npm install @types/leaflet
```

If you want to run the demo, clone the repository, perform an ```npm install```, ```gulp dev``` and then go to http://localhost:9000/src/demo/index.html


## Usage

### Import the Leaflet Stylesheet
For leaflet to work, you need to have the leaflet stylesheets loaded into your application.
If you've installed via npm, you will need to load ```./node_modules/leaflet/dist/leaflet.css```. 
How you include the stylesheet will depend on your specific setup. Here are a few examples:

#### Direct Import from HTML
If you are just building a webpage and not using a bundler for your css, you'll want to directly import the css file in your HTML page.

```html
<head>
	...
	<link rel="stylesheet" type="text/css" href="./node_modules/leaflet/dist/leaflet.css">
	...
</head>
```

#### Webpack
If you are using Webpack, you will need to import the css file and have a style-loader configured.
You can use the demo included in this application as a reference.

Generally, in ```vendor.ts```:
```ts
import 'leaflet/dist/leaflet.css';
```

And then in your webpack config file:
```js
{
    ...
    "module" : {
		loaders: [
		    ...
		    { test: /\.css$/, loaders: [ 'style-loader', 'css-loader' ] },
		    ...
		]    
    },
    ...
}
```


#### Angular CLI
If you are using Angular CLI, you will need to add the Leaflet CSS file to the styles array contained in ```.angular-cli.json```

```js
{
    ...
    "apps": [
        {
            ...
        	"styles": [
                "styles.css",
                "../node_modules/leaflet/dist/leaflet.css"
            ],
            ...
        }
    ]
    ...
}
```

#### Typescript and Angular 2+ Module Import
In your ```app.module.ts```, add:
 
```js
import { LeafletModule } from '@asymmetrik/angular2-leaflet';

...
imports: [
    ...
    LeafletModule
]
...

```


### Basic Map Setup
To create a map, use the ```leaflet``` attribute directive.
You must specify an initial zoom/center and set of layers either via ```leafletOptions``` or by binding to ```leafletZoom```, ```leafletCenter```, and ```leafletLayers```.
For an example of the basic map setup, you should check out the *Core* demo.

```html
<div leaflet style="height: 300px;"
     [leafletOptions]="options">
</div>
```
#### leaflet
This is the attribute directive that activates the plugin and creates the map.

#### leafletOptions
Input binding for the initial leaflet map options (see [Leaflet's](http://leafletjs.com) docs).
These options can only be set initially because they are used to create the map. Later changes are ignored.`

Example:

```js
options = {
	layers: [
		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
	],
	zoom: 5,
	center: L.latLng({ lat: 38.991709, lng: -76.886109 })
};
```

See the API section below for details regarding how to bind additional options, dynamically bind baselayers, layers, overlays, and layer controls.


## API

### Advanced Map Configuration
There are several input bindings available for configuring the map.

```html
<div leaflet style="height: 300px;"
     [leafletOptions]="options"
     [leafletPanOptions]="panOptions"
     [leafletZoomOptions]="zoomOptions"
     [leafletZoomPanOptions]="zoomPanOptions"
     [leafletFitBoundsOptions]="fitBoundsOptions">
</div>
```

#### leafletOptions
Input binding for the initial leaflet map options (see [Leaflet's](http://leafletjs.com) docs). These options can only be set initially because they are used to create the map. Later changes are ignored.

#### leafletPanOptions
Input binding for pan options (see [Leaflet's](http://leafletjs.com) docs). These options are stored and used whenever pan operations are invoked.

#### leafletZoomOptions
Input binding for zoom options (see [Leaflet's](http://leafletjs.com) docs). These options are stored and used whenever zoom operations are invoked.

#### leafletZoomPanOptions
Input binding for zoom/pan options (see [Leaflet's](http://leafletjs.com) docs). These options are stored and used whenever zoom/pan operations are invoked.

#### leafletFitBoundsOptions
Input binding for FitBounds options (see [Leaflet's](http://leafletjs.com) docs). These options are stored and used whenever FitBounds operations are invoked.


### Dynamically changing zoom level, center, and fitBounds
```html
<div leaflet style="height: 300px;"
     [leafletOptions]="options"
     [leafletZoom]="zoom"
     [leafletCenter]="center"
     [leafletFitBounds]="fitBounds">
</div>
```

#### leafletZoom
Input bind a zoom level to the map.

```js
zoom: number
```

On changes, the component applies the new zoom level to the map.
There is no output binding or events emitted for map zoom level changes made using the map controls.


#### leafletCenter
Input bind a center position to the map.

```js
center: L.LatLng
```

On changes, the component re-centers the map on the center point.
There is no output binding or events emitted for map pan changes made using map controls.


#### Note: center/zoom operations may cancel each other
Zoom/Center operations cancel each other.
If both changes are picked up at the same time, they will be applied as a map.setView() operation so both are processed.


#### leafletFitBounds
Input bind a fitBound operation to the map.

```js
fitBounds: L.LatLngBounds
```

On changes, the component calls map.fitBounds using the bound parameter.


### Simple Layer Management: Setting Baselayers
There is a convenience input binding for setting the baselayers on the map called ```leafletBaseLayers```.
You can also provide ```leafletLayersControlOptions``` if you want to show the control on the map that allows you to switch between baselayers.
If you plan to show more than just baselayers, you should use the more advanced layers controls described in *Advanced Layer Management* below.

For an example of the basic map setup, you should check out the *Simple Base Layers* demo.

```html
<div leaflet style="height: 300px;"
     [leafletOptions]="options"
     [leafletBaseLayers]="baseLayers"
     [leafletLayersControlOptions]="layersControlOptions">
</div>
```

#### leafletBaseLayers
Input bind an ```L.control.LayersObject``` to be synced to the map.

```js
baseLayers: {
	'layer1': L.Layer,
	'layer2': L.Layer
}
```

On changes, the component syncs the baseLayers on the map with the layers in this object.
Syncing is performed by tracking the current baselayer and on changes, searching the map to see if any of the current baselayers is added to the map.
If it finds a baselayer that is still added to the map, it will assume that is still the baselayer and leave it.
If none of the baselayers can be found on the map, it will add the first layer it finds in the ```L.control.LayersObject``` and use that as the new baselayer.
Layers are compared using instance equality.

If you use this directive, you can still manually use the ```leafletLayers``` directive, but you will not be able to use the ```leafletLayersControl``` directive.
This directive will interfere with the ```leafletLayersControl``` directive.
However, because it uses ```L.control.Layers``` under the hood, you can still provide options for the layers control.   


### leafletLayersControlOptions
Input binding for Control.Layers options (see [Leaflet's](http://leafletjs.com) docs).
These options are passed into the layers control constructor on creation.


### Advanced Layer Management: Layers, and Layers Control
The ```leafletLayers``` and ```leafletLayersControl``` input bindings give you direct access to manipulate layers and the layers control.
When the array bound to ```leafletLayers``` is changed, the directive will synchronize the layers on the map to the layers in the array.
This includes tile layers and any added shapes.

The ```leafletLayersControl``` input binding allows you to provide a set of base layers and overlay layers that can be managed within leaflet using the layers control.
When the user manipulates the control via Leaflet, Leaflet will automatically manage the layers, but the input bound layer array isn't going to get updated to reflect those changes.

So, basically, you use ```leafletLayers``` to assert what should be added to/removed from the map.
Use ```leafletLayersContro``` to tell Leaflet what layers the user can optionally turn on and off.

For an example of using the layers controls, you should check out the *Layers and Layer Controls* demo.

```html
<div leaflet style="height: 300px;"
     [leafletOptions]="options"
     [leafletLayers]="layers"
     [leafletLayersControl]="layersControl"
     [leafletLayersControlOptions]="layersControlOptions">
</div>
```

#### leafletLayers
Input bind an array of all layers to be synced (and made visible) in the map.

```js
layers: L.Layer[]
```

On changes, the component syncs the layers on the map with the layers in this array.
Syncing is performed by selectively adding or removing layers. Layers are compared using instance equality.
As a result of how the map is synced, the order of layers is not guaranteed to be consistent as changes are made.


#### leafletLayersControl
Input bind a Control.Layers specification. The object contains properties for each of the two constructor arguments for the Control.Layers constructor.

```js
layersControl: {
	baseLayers: {
		'layerName': L.Layer
	},
	overlays: {
		'overlayName': L.Layer
	}
}
```

### leafletLayersControlOptions
Input binding for Control.Layers options (see [Leaflet's](http://leafletjs.com) docs).
These options are passed into the constructor on creation.


### Getting a Reference to the Map
Occasionally, you may need to directly access the Leaflet map instance.
For example, to call ```invalidateSize()``` when the map div changes size or is shown/hidden.
There are a couple of different ways to achieve this depending on what you're trying to do.

The easiest and most flexible way is to use the output binding ```leafletMapReady```.
This output is invoked after the map is created, the argument of the event being the ```L.Map``` instance.

The second is to get a reference to the leaflet directive itself - and there are a couple of ways to do this.
With a reference to the directive, you can invoke the ```getMap()``` function to get a reference to the ```L.Map``` instance.


#### leafletMapReady
This output is emitted when once when the map is initially created inside of the Leaflet directive.
The event will only fire when the map exists and is ready for manipulation.

```html
<div leaflet
	[leafletOptions]="options"
	(leafletMapReady)="onMapReady($event)">
</div>
```

```js
onMapReady(map: L.Map) {
	// Do stuff with map
}
```

This method of getting the map makes the most sense if you are using the Leaflet directive inside your own component
and just need to add some limited functionality or register some event handlers.


#### Inject LeafletDirective into your Component
In Angular 2, directives are injectable the same way that Services are.
This means that you can create your own component or directive and inject the ```LeafletDirective``` into it.
This will only work if your custom component/directive exists on the same DOM element and is ordered after the injected LeafletDirective.

```html
<div leaflet myCustomDirective>
</div>
```

```js
@Directive({
	selector: '[myCustomDirective]'
})
export class MyCustomDirective {
	leafletDriective: LeafletDirective;
	
	constructor(leafletDirective: LeafletDirective) {
    	this.leafletDirective = leafletDirective;
    }

	someFunction() {
	    if (null != this.leafletDirective.getMap()) {
	        // Do stuff with the map
	    }
	}
}
```

The benefit of this approach is it's a bit cleaner if you're interested in adding some reusable capability to the existing leaflet map directive.
This is how the ```@asymmetrik/angualr2-leaflet-draw``` and ```@asymmetrik/angualr2-leaflet-d3``` packages work, so you can use them as references.


### A Note About Markers
If you use this component in an Angular 2 project and your project uses a bundler like Webpack, you might run into issues using Markers on maps.
The issue is related to how Leaflet manipulates the image URLs used to render markers when you are using the default marker images.
The url manipulation is done at runtime and it alters the URLs in a way that breaks their format (this happens regardless of if you're using a file-loader or a url-loader).
The demo contained in this project demonstrates how to get around this problem (at least in a Webpack environment).
But, here is a rough overview of the steps taken to get them working.

#### Webpack Marker Workaround

1. Import the marker images in your vendor file to get Webpack to process the images in the asset pipeline

		import 'leaflet/dist/images/marker-shadow.png';
		import 'leaflet/dist/images/marker-icon.png';

1. Either host the images statically or use the file-loader Webpack plugin to generate the images.
1. Determine the correct URL for the marker and marker-shadow images. If you're using a file hasher, you should be able to check Webpack's output for the generated images. If you are serving them directly without chunk hashing just figure out how to resolve the images on your server.
1. Configure Leaflet to use the correct URLs as customer marker images

		let layer= L.marker([ 46.879966, -121.726909 ], {
			icon: L.icon({
				iconSize: [ 25, 41 ],
				iconAnchor: [ 13, 0 ],
				iconUrl: '2273e3d8ad9264b7daa5bdbf8e6b47f8.png',
				shadowUrl: '44a526eed258222515aa21eaffd14a96.png'
			})
		});

#### Angular CLI Marker Workaround

If you build your project using the [Angular CLI](https://github.com/angular/angular-cli), as of angular-cli release 1.0.0-rc.1 you can make the default leaflet marker assets available by doing the following:

1. Edit `.angular-cli` (formerly `angular-cli.json`)
1. Configure the CLI to include leaflet assets as below. Detailed instructions can be found in the [asset-configuration](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/asset-configuration.md) documentation. 
    ```json
    {
      "project": {
        ...
      },
      "apps": [
        {
          ...
          "assets": [
            "assets",
            "favicon.ico",
            {
              "glob": "**/*",
              "input": "../node_modules/leaflet/dist/images",
              "output": "./assets/"
            }
          ]
        }
      ]
    }
    ```

1. When using markers in your code, you can now use references like : ```L.icon( { iconUrl: 'assets/marker-icon.png', shadowUrl: 'assets/marker-shadow.png' } )```

## Contribute
PRs accepted. If you are part of Asymmetrik, please make contributions on feature branches off of the ```develop``` branch. If you are outside of Asymmetrik, please fork our repo to make contributions.


## License
See LICENSE in repository for details.


## Credits
**[Leaflet](http://leafletjs.com/)** Is an awesome mapping package.
