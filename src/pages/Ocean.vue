<template>
	<div class="map-container">
		<div id="map" class="map"></div>
		<TimeBar :time="time" class="time-bar" @on-time-change="timeChange"/>
		<div class="platform">
			<ul>
				<li v-for="(icon, index) in icons" :key="index">
					<img :src="icon.url">
				</li>
			</ul>
		</div>
	</div>
  
</template>

<script>
import Map from 'ol/map'
import Tile from 'ol/layer/tile'
import OSM from 'ol/source/osm'
import TileWMS from 'ol/source/tilewms'
import View from 'ol/View'

import TimeBar from '@/components/TimeBar'
export default {
	data () {
		return {
			msg: '',
			map: null,
			time: Date.now(),
			icons: [
				{
					url: '/static/icon_1.png'
				},
				{
					url: '/static/icon_2.png'
				},
				{
					url: '/static/icon_3.png'
				},
				{
					url: '/static/icon_4.png'
				},
				{
					url: '/static/icon_5.png'
				},
				{
					url: '/static/icon_6.png'
				},
				{
					url: '/static/icon_7.png'
				}
			]
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
				zoom: 2.4,
				minZoom: 2.4
			})
		})
		this.map.on('movestart', (data) => {
			console.log(data)
		})
		this.map.addLayer(new Tile({
					source: new TileWMS({
						url: 'http://39.106.10.110:8080/geoserver/test/wms?service=WMS&version=1.1.0&request=GetMap&layers=test:chla&styles=&bbox=-180.0,-65.0,180.0,65.0&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2'
					})
				}))
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
		bottom: 48px;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height:0;
		border-width:0 5px 20px 5px;
		border-style:none solid solid;
		border-color:transparent transparent rgba(0, 0, 0, 0.3);
		> ul {
			width: 100%;
			position: absolute;
			top: -24px;
			display: flex;
			justify-content: space-around;
		}
		li {
			width: 40px;
			height: 40px;
		}
		img {
			width: 100%;
			height: 100%;
			display: block;
		}
		img:hover {
			transform: scale(1.2);
		}
	}
</style>
