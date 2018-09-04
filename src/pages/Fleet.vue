<template>
  <div class="map-container">
    <div id="map" class="map">
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
      <el-row>
        <el-col :span="19" :push="1">
          <el-input placeholder="请输入船只名称搜索" size="mini"></el-input>
        </el-col>
        <el-col :span="2" :push="1">
          <el-button type="primary" size="mini" icon="el-icon-search"></el-button>
        </el-col>
      </el-row>
      <el-row class="hot-search">
        <el-col :span="6">热门搜索</el-col>
        <el-col :span="6" class="hot-search-result">xxx号</el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="船只信息"
      :visible.sync="dialog.visible"
      width="30%">
      <span>名称: {{ dialog.name }}</span><br><br>
      <span>地区: {{ dialog.region}}</span>
    </el-dialog>
  </div>
</template>

<script>
// import Map from 'ol/map'
// import Tile from 'ol/layer/tile'
// import OSM from 'ol/source/osm'
// import TileWMS from 'ol/source/tilewms'
// import View from 'ol/View'

const Map = ol.Map
const Tile = ol.layer.Tile
const OSM = ol.source.OSM
const TileWMS = ol.source.TileWMS
const View = ol.View

const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const Style = ol.style.Style
const Icon = ol.style.Icon
const Feature = ol.Feature
const Point = ol.geom.Point
const proj = ol.proj
const Overlay = ol.Overlay
const ZoomSlider = ol.control.ZoomSlider
const LineString = ol.geom.LineString
const Graticule = ol.Graticule

// import Style from 'ol/style/style'
// import Icon from 'ol/style/icon'
// import Feature from 'ol/feature'
// import Point from 'ol/geom/point'
// import proj from 'ol/proj'
// import Overlay from 'ol/overlay'
// import ZoomSlider from 'ol/control/zoomslider.js'
// import 'ol/ol.css'
// import LineString from 'ol/geom/linestring'
// http://openlayers.org/en/latest/examples/icon-color.html

const unReactiveData = {
  map: null,
  iconStyle: null, // 船的图标style
  shipLayer: null, // 船图层
  trailLayer: null, // 轨迹图层
}

export default {
	data () {
		return {
      shipQuery: {

      }, // 小船的查询数据
			msg: '',
      mapPos: [115, 0],
      shipSearch: {
        nation: '',
        type: '',
        name: ''
      },
      dialog: {
        visible: false,
        name: '',
        region: ''
      }
		}
	},
	mounted () {
    this.initMap()
    this.renderShip()
    this.bindEvent()
    // this
    //   .getShoals()
    //   .then(responseData => this.formatShoals(responseData.data))
    //   .then(data => {
    //     return this.getShipStatusList(data)
    //   })
    //   .then(responseData => this.formatShipStatusList(responseData.data))
    //   .then(this.drawShip)
    //   .then(() => {
    //     unReactiveData.map.updateSize()
    //     this.bindEvent()
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   })
  },
  methods: {
    initMap () {
      // 设置map
      unReactiveData.map = new Map({
        layers: [
          new Tile({
            source: new OSM({
              wrapX: false
            }),
          })
        ],
        target: 'map',
        view: new View({
          center: proj.fromLonLat(this.mapPos),
          zoom: 2.4,
          minZoom: 2.4,
        })
      })
      var graticule = new Graticule({
        // the style to use for the lines, optional.
        map: unReactiveData.map
        // showLabels: true
      })
      // 设置小船的样子
      unReactiveData.iconStyle = new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          src: '/static/ship.png',
          scale: 0.3
        })
      })
      // 添加控制器
      unReactiveData.map.addControl(new ZoomSlider())
    },
    // 渲染小船们
    renderShip () {
      // 获取小船数据, 数据format 渲染
      this
        .getShip(this.shipQuery)
        .then(response => {
          if (response.code === '0' && Array.isArray(response.data)) {
            return this.formatShip(response.data)
          } else {
            return Promise.reject('error')
          }
        })
        .then(this.drawShip)
    },
    // 过滤数据
    formatShip (shoals) {
      return Promise.resolve(shoals.filter(v => {
        return v.latitude && v.longitude
      }))
    },
    // 绘制小船
    drawShip (ships) {
      if (unReactiveData.shipLayer) {
        unReactiveData.map.removeLayer(unReactiveData.shipLayer)
      }
      unReactiveData.shipLayer = new VectorLayer({
        source: new VectorSource({
          features: ships.map(ship => {
            let icon = new Feature({
              geometry: new Point(
                proj.fromLonLat([ship.longitude, ship.latitude])
              )
            })
            icon.shipInfo = ship
            icon.setStyle(unReactiveData.iconStyle)

            return icon
          })
        })
      })
      unReactiveData.map.addLayer(unReactiveData.shipLayer)
    },
    bindEvent () {
      unReactiveData.map.on('click', evt => {
        let feature = unReactiveData.map.forEachFeatureAtPixel(evt.pixel, feature => {
          console.log(feature)
          var coordinates = feature.getGeometry().getCoordinates();
          if (feature.shipInfo) {
            this.focusShip(feature.shipInfo)
            this.showShipInfo(feature.shipInfo)
            this.showTrail(feature.shipInfo)
          } else {
          }
          unReactiveData.map.updateSize()
        })
      })
    },
    // 显示船的轨迹
    showTrail (shipInfo) {
      this.hideTrail()
      this
        .$http
        .post('/shipStatus/shipStatusListByShipId', {
          mmsiNum: shipInfo.shipMmsi,
          beginTime: 1535299200,
          endTime: 1535472000
        })
        .then(response => {
          // console.log(response)
          if (response.code == '0' && Array.isArray(response.data)) {
            this.drawTrail(response.data.map(point => {
              return proj.fromLonLat([
                point.longitude,
                point.latitude
              ])
            }))
          }
        })
    },
    hideTrail () {
      if (unReactiveData.trailLayer) {
        unReactiveData.map.removeLayer(unReactiveData.trailLayer)
      }
    },
    drawTrail (pointsArray) {
      unReactiveData.trailLayer = new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature(new LineString(pointsArray))
          ]
        })
      })
      unReactiveData.map.addLayer(unReactiveData.trailLayer)
      unReactiveData.map.updateSize()
    },
    showShipInfo (shipInfo) {
      // 点击之后显示船信息
      this.dialog.visible = true
      this.dialog.name = shipInfo.shipName
      this.dialog.region = shipInfo.shipRegion
    },
    closeShipInfo () {
      this.dialog.visible = false
      this.dialog.name = ''
      this.dialog.region = ''
    },
    getShip (query) {
      return this
        .$http
        .post('/ship/shipList', query)
    },
    // 聚焦到小船身上
    focusShip (shipInfo) {
      unReactiveData
        .map
        .getView()
        .animate({
          center: proj.fromLonLat([
            shipInfo.longitude,
            shipInfo.latitude
          ]),
          duration: 1000,
          zoom: 9
        })
    },
    // 移动地图
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
      unReactiveData.map.getView().setCenter(proj.fromLonLat(this.mapPos))
    },
    // 全局的时间变化
    globalTimeChange (times) {
      console.log(times)
    }
  }
}
//'/shipStatus/shipStatusList'
</script>

<style lang="less" scope>
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
    padding: 10px 10px 10px 0px;
    border-radius: 4px;
    background: #FFF;
    position: absolute;
    top: .5em;
    right: .5em;
  }
  .hot-search {
    padding-left: 4px;
    color: #606266;
    padding-top: 10px;
    font-size: 12px;
    text-align: center;
  }
  .hot-search-result {
    cursor: pointer;
    color: #409EFF;
  }
  .el-dialog__body {
    padding: 10px 20px 20px 20px;
  }
</style>