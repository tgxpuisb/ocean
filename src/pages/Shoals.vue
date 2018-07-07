<template>
  <div class="map-container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import Map from 'ol/map'
import Tile from 'ol/layer/tile'
import OSM from 'ol/source/osm'
import TileWMS from 'ol/source/tilewms'
import View from 'ol/View'

import Vector from 'ol/layer/vector'
import SourceVector from 'ol/source/vector'
import Style from 'ol/style/style'
import Icon from 'ol/style/icon'
import Feature from 'ol/feature'
import Point from 'ol/geom/point'
import proj from 'ol/proj'
// http://openlayers.org/en/latest/examples/icon-color.html


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
        }),
        new Vector({
          // style
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
			// console.log(data)
    })
    this.getShoals()
      .then(({ data: responseData }) => {
        console.log(responseData)
        // 数组
        let ships = []
        let iconStyle = new Style({
          image: new Icon({
            crossOrigin: 'anonymous',
            src: '/static/ship.png'
          })
        })
        if (Array.isArray(responseData.data)) {
          responseData.data.forEach((v, index) => {
            let ship = new Feature({
              geometry: new Point(proj.fromLonLat([12.5 + index * 4, 41.9 + index * 2]))
            })
            ship.setStyle(iconStyle)
            ships.push(ship)
          })
        }
        // todo
        // var rome = new Feature({
        //   geometry: new Point(proj.fromLonLat([12.5, 41.9]))
        // })
        // rome.setStyle(new Style({
        //   image: new Icon({
        //     color: '#8959A8',
        //     crossOrigin: 'anonymous',
        //     src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'
        //   })
        // }))
        var romeSource = new SourceVector({
          features: ships
        })
        var romeLayer = new Vector({
          source: romeSource
        })
        this.map.addLayer(romeLayer)
      })
  },
  methods: {
    getShoals () {
      return this
        .$http
        .post('/ship/shipList', {
 "shipStatusList": [{
  "mmsiNum": 412354269,"type": 1
 }, {
  "mmsiNum": 412420244,"type": 1
 }],
 "beginTime": 1528992021,"endTime": 1528992106
})
    }
  }
}
//'/shipStatus/shipStatusList'
</script>

<style lang="less">
	.map {
		width: 100%;
	}
</style>
