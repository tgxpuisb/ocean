<template>
  <div id="map" class="map"></div>
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
    this.initMap()
    this
      .getShoals()
      .then(({ data: responseData }) => this.formatShoals(responseData.data))
      .then(data => {
        return this.getShipStatusList(data)
      })
      .then(({ data: responseData }) => this.formatShipStatusList(responseData.data))
      .then(this.drawShip)
      .then(() => {
        this.map.updateSize()
        this.bindEvent()
      })
      .catch(e => {
        console.log(e)
      })
  },
  methods: {
    initMap () {
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
      this.iconStyle = new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          src: '/static/ship.png',
          scale: 0.6
        })
      })
    },
    bindEvent () {
      this.map.on('click', evt => {
        let feature = this.map.forEachFeatureAtPixel(evt.pixel, feature => {
          console.log(feature)
        })
        // console.log(feature)
      })
    },
    getShoals () {
      return this
        .$http
        .post('/ship/shipList', {})
    },
    formatShoals (shoals) {
      return Promise.resolve(shoals.map(v => {
        return {
          mmsiNum: v.shipMmsi,
          type: v.shipType
        }
      }))
    },
    getShipStatusList (list, duration = {}) {
      let beginTime,endTime
      return this
          .$http
          .post('/shipStatus/shipStatusList', {
            shipStatusList: list,
            beginTime: 1528992021,
            endTime: 1528992106
          })
    },
    formatShipStatusList (list) {
      return Promise.resolve(list.filter(v => v.shipStatusInfo))
    },
    drawShip (ships) {
      console.log(ships)
      let source = new SourceVector({
        features: ships.map(ship => {
          let icon = new Feature({
            geometry: new Point(proj.fromLonLat([ship.shipStatusInfo.longitude, ship.shipStatusInfo.latitude]))
          })
          icon.setStyle(this.iconStyle)
          return icon
        })
      })
      let layer = new Vector({
        source
      })
      this.map.addLayer(layer)
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