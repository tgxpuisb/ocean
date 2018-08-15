<template>
	<div class="map-container">
		<div id="map" class="map"></div>
		<TimeBar :time="time" class="time-bar" @on-time-change="timeChange"/>
		<div class="platform"></div>
	</div>
  
</template>

<script>
// import Map from 'ol/map'
const Map = ol.Map
const Tile = ol.layer.Tile
// import Tile from 'ol/layer/tile'
const OSM = ol.source.OSM
const TileWMS = ol.source.TileWMS
// import OSM from 'ol/source/osm'
// import TileWMS from 'ol/source/tilewms'
const View = ol.View
// import View from 'ol/View'
// import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer.js';
// import ImageLayer from 'ol/layer/image'
const ImageLayer = ol.layer.Image
// import ImageWMS from 'ol/source/imagewms';
const ImageWMS = ol.source.ImageWMS

// const { WindLayer } = require('@/assets/Wind')
// console.log(WindLayer)

import axios from 'axios'

import TimeBar from '@/components/TimeBar'
export default {
	data () {
		return {
			msg: '',
			map: null,
			time: Date.now()
		}
	},
	mounted () {
		this.map = new Map({
			layers: [
				new Tile({
					source: new OSM()
				})
			],
			target: 'map',
			view: new View({
				center: [0, 0],
				zoom: 2,
				minZoom: 2,
				// projection:'EPSG:3857'
			}),
			loadTilesWhileAnimating: true
		})
		this.map.on('movestart', (data) => {
			console.log(data)
		})
		this.map.addLayer(new Tile({
			source: new TileWMS({
				url: '/geo/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite:sst&styles=&bbox=-179.99999694739424,-79.99999694633365,179.99999694739424,79.99999694633365&width=768&height=341&srs=EPSG:4326&format=application%2Fopenlayers2',
				params: {
					LAYERS:'cite:sst',
					STYLES:'nc_sst',
					TILED:true
				},
				serverType: 'geoserver',
				ratio:1
			})
		}))
		// this.map.addLayer(new ImageLayer({
		// 	source: new ImageWMS({
		// 		url: '/geo/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite:sst&styles=&bbox=-179.99999694739424,-79.99999694633365,179.99999694739424,79.99999694633365&width=768&height=341&srs=EPSG:4326&format=application%2Fopenlayers2',
		// 		params:{    
    //     	LAYERS: 'cite:sst',
		// 			STYLES: 'nc_sst',
    //     	TILED: true
		// 		},
		// 		serverType:'geoserver',
		// 		ratio: 1
		// 	})
		// }))
		// this.map.addLayer()
		// axios.get('/out1.json').then(res => {
		// 	if (res.data) {
		// 		let wind = new WindLayer(res.data, {
		// 			projection: 'EPSG:3857',
		// 			ratio: 1
		// 		})
		// 		wind.appendTo(this.map)
		// 	}
		// })
	},
	methods: {
		timeChange (time) {
			console.log(time)
		}
	},
  components: {
    TimeBar
  }
}
</script>

<style lang="less">
	.map {
		width: 100%;
	}
	.time-bar {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.platform {
		position: absolute;
		bottom: 60px;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height:0;
		border-width:0 5px 30px 5px;
		border-style:none solid solid;
		border-color:transparent transparent rgba(0, 0, 0, 0.3);
	}
</style>
