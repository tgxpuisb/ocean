<template>
  <div class="map-container">
    <div id="map" class="map">
      <div id="ship-popup" class="ship-info" v-show="currentShipInfo.show">
        <p class="ship-name" v-text="currentShipInfo.name"></p>
        <p class="ship-region" v-text="currentShipInfo.shipRegion"></p>
      </div>
    </div>
    <div class="position-control ol-control">
      <button class="top" @click="moveMap('top')">↑</button>
      <button class="bottom" @click="moveMap('bottom')">↓</button>
      <button class="right" @click="moveMap('right')">→</button>
      <button class="left" @click="moveMap('left')">←</button>
    </div>
    <el-form label-width="80px" ref="form" :model="shipSearch" class="search-form" size="mini">
      <el-form-item label="国家地区">
        <el-select v-model="shipSearch.nation" placeholder="请选择国家地区">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="船只类型">
        <el-select v-model="shipSearch.type" placeholder="请选择船只类型">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="船只名称">
        <el-select v-model="shipSearch.name" placeholder="请选择船只名称">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
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
import ZoomSlider from 'ol/control/zoomslider.js'
import 'ol/ol.css'

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
      },
      mapPos: [115, 0],
      shipSearch: {
        nation: '',
        type: '',
        name: ''
      }
		}
	},
	mounted () {
    this.initMap()
    this.initPopup()
    this
      .getShoals()
      .then(responseData => this.formatShoals(responseData.data))
      .then(data => {
        return this.getShipStatusList(data)
      })
      .then(responseData => this.formatShipStatusList(responseData.data))
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
          center: proj.fromLonLat(this.mapPos),
          zoom: 2.4,
          minZoom: 2.4
        })
      })
      this.iconStyle = new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          src: '/static/ship.png',
          scale: 0.3
        })
      })
      this.map.addControl(new ZoomSlider())
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
        .then(responseData => {
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
      console.log(shoals)
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
    },
    moveMap (direction) {
      const MAX_LON = 180
      const MIN_LON = -180
      const MAX_LAT = 60
      const MIN_LAT = -60
      let value
      switch (direction) {
        case 'top':
          value = this.mapPos[1] + 20
          if (value > MAX_LAT) {
            value = MAX_LAT
          }
          this.mapPos[1] = value
          break
        case 'bottom':
          value = this.mapPos[1] - 20
          if (value < MIN_LAT) {
            value = MIN_LAT
          }
          this.mapPos[1] = value
          break
        case 'left':
          value = this.mapPos[0] - 20
          if (value < MIN_LON) {
            value += 360
          }
          this.mapPos[0] = value
          break
        case 'right':
          value = this.mapPos[0] + 20
          if (value > MAX_LON) {
            value -= 360
          }
          this.mapPos[0] = value
          break
        default:
          break
      }
      this.map.getView().setCenter(proj.fromLonLat(this.mapPos))
    }
  }
}
//'/shipStatus/shipStatusList'
</script>

<style lang="less">
  .map-container {
    position: relative;
    width: 100%;
  }
	.map {
    width: 100%;
    height: 600px;
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
  .ol-attribution {
    display: none;
  }
  .position-control { 
    width: 4.5em;
    height: 4.5em;
    background: rgba(255, 255, 255, 0.6);
    position: absolute;
    bottom: 20px;
    left: .5em;
    > button {
      position: absolute;
    }
    .top {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .bottom {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .left {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .right {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .search-form {
    background: #FFF;
    position: absolute;
    top: .5em;
    right: .5em;
  }
</style>