<template>
  <div id="map" class="map">
    <div id="ship-popup" class="ship-info" v-show="currentShipInfo.show">
      <p class="ship-name" v-text="currentShipInfo.name"></p>
      <p class="ship-region" v-text="currentShipInfo.shipRegion"></p>
    </div>
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
import Overlay from 'ol/overlay'

import LineString from 'ol/geom/linestring'
// http://openlayers.org/en/latest/examples/icon-color.html


export default {
	data () {
		return {
			msg: '',
      // map: null,
      currentShipInfo: {
        x: 0,
        y: 0,
        name: '',
        show: false,
        shipRegion: ''
      }
		}
	},
	mounted () {
    this.initMap()
    this.initPopup()
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
          center: proj.fromLonLat([115, 0]),
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
          var coordinates = feature.getGeometry().getCoordinates();
          this.popup.setPosition(coordinates);
          if (feature.shipInfo) {
            this.showShipInfo(feature.shipInfo)
            this.showGuiji(feature.shipInfo)
          } else {
            this.closeShipInfo()
          }
          this.map.updateSize()
        })
        // console.log(feature)
      })
    },
    initPopup () {
      this.popup = new Overlay({
        element: document.getElementById('ship-popup'),
        positioning: 'top-left',
        stopEvent: false,
        offset: [0, -50]
      })
      this.map.addOverlay(this.popup)
    },
    showGuiji (shipInfo) {
      this
        .$http
        .post('/shipStatus/shipStatusListByShipId', {
          shipId: 8 || shipInfo.shipId,
          beginTime: 1528990021,
          endTime: 1528992106
        })
        .then(({ data: responseData }) => {
          console.log(responseData)
          if (Array.isArray(responseData.data)) {
            let points = responseData.data.map(point => {
              return proj.fromLonLat([
                point.longitude,
                point.latitude
              ])
            })
            console.log(points)
            let layer = new Vector({
              source: new SourceVector({
                features: [
                  new Feature(new LineString(points))
                ]
              })
            })
            this.map.addLayer(layer)
            this.map.updateSize()
          } 
          // todo
          // let points="-90 90,90 -90,100 50,150 80.66666"
          let points = [ [-89.8802, 32.5804], [25.4286, 46.9235] ].map(v => proj.fromLonLat(v))
          const radius = 10e6;
          const cos30 = Math.cos(Math.PI / 6);
          const sin30 = Math.sin(Math.PI / 6);
          const rise = radius * sin30;
          const run = radius * cos30;
          // console.log([0, radius], [run, -rise], [-run, -rise], [0, radius])
          const triangle = new LineString(points);
          let layer = new Vector({
            source: new SourceVector({
              features: [
                new Feature(triangle)
              ]
            })
          })
          this.map.addLayer(layer)
        })
    },
    showShipInfo (shipInfo) {
      // 点击之后显示船信息
      this.currentShipInfo.show = true
      this.currentShipInfo.name = shipInfo.shipName
      this.currentShipInfo.shipRegion = shipInfo.shipRegion
    },
    closeShipInfo () {
      this.currentShipInfo.show = false
      this.currentShipInfo.name = ''
      this.currentShipInfo.shipRegion = ''
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
          icon.shipInfo = ship.shipStatusInfo
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
    position: relative;
  }
  .ship-info {
    padding: 12px;
    width: 100px;
    background: #FFF;
    z-index: 9999;
    p {
      padding: 4px;
    }
    .ship-name {
      text-align: center;
    }
    .ship-region {
      text-align: center;
    }
  }
</style>