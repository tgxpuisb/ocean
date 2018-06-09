<template>
  <div id="map" class="map"></div>
</template>

<script>
import Map from 'ol/map'
import Tile from 'ol/layer/tile'
import OSM from 'ol/source/osm'
import TileWMS from 'ol/source/tilewms'
import View from 'ol/View'

export default {
	data () {
		return {
			msg: '',
			map: null
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
	}
}
</script>

<style lang="less">
	.map {
		width: 100%;
	}
</style>
