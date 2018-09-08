<template>
  <div>
    <div class="btn-control">
      <el-form ref="form" :model="form" label-width="80px" inline>
        <el-form-item label="经纬度" class="m-b-0">
            <el-switch v-model="form.address"></el-switch>
          </el-form-item>
        <el-form-item label="卫星地图" class="m-b-0">
          <el-switch v-model="form.satelliteMap"></el-switch>
        </el-form-item>
        <el-form-item label="测距" class="m-b-0">
          <el-switch v-model="form.ranging"></el-switch>
        </el-form-item>
        <el-form-item label="取点" class="m-b-0">
          <el-switch v-model="form.point"></el-switch>
        </el-form-item>
      </el-form>
    </div>

    <div class="map-container">
      <div id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
// import Map from 'ol/map'
// import Tile from 'ol/layer/tile'
// import OSM from 'ol/source/osm'
// import TileWMS from 'ol/source/tilewms'
// import View from 'ol/View'

// import Vector from 'ol/layer/vector'
// import SourceVector from 'ol/source/vector'
// import Style from 'ol/style/style'
// import Icon from 'ol/style/icon'
// import Feature from 'ol/feature'
// import Point from 'ol/geom/point'
// import proj from 'ol/proj'
// import LineString from 'ol/geom/linestring'
const Map = ol.Map
const Tile = ol.layer.Tile
const OSM = ol.source.OSM
const TileWMS = ol.source.TileWMS
const View = ol.View

const Vector = ol.layer.Vector
const SourceVector = ol.source.Vector
const Style = ol.style.Style
const Icon = ol.style.Icon
const Feature = ol.Feature
const Point = ol.geom.Point
const proj = ol.proj
const LineString = ol.geom.LineString
const Graticule = ol.Graticule

// http://openlayers.org/en/latest/examples/icon-color.html
const unReactiveData = {
  map: null,
  fishIconStyle: null, // 金枪鱼图标
  sleeveFishIconStyle: null, // 鱿鱼图标
  shoalsLayer: null
}

export default {
	data () {
		return {
		  form: {
        address: false,
        satelliteMap: false,
        ranging: false,
        point: false
      },
		}
	},
	mounted () {
    this.initMap()
    this.initIconStyle()
    this.drawShoals()
    // this.drawLine()
  },
  methods: {
    initMap () {
      unReactiveData.map = new Map({
        layers: [
          new Tile({
            source: new OSM({
              wrapX: false
            })
          })
        ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2.8,
          minZoom: 2.8
        })
      })
      var graticule = new Graticule({
        map: unReactiveData.map
        // showLabels: true
      })
    },
    initIconStyle () {
      unReactiveData.fishIconStyle = new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          src: '/static/fish.png',
          scale: 0.4
        })
      })
      unReactiveData.sleeveFishIconStyle = new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          src: '/static/sleeve-fish.png',
          scale: 0.4
        })
      })
    },
    // 绘制鱼群
    drawShoals () {
      if (unReactiveData.shoalsLayer) {
        unReactiveData.map.removeLayer(unReactiveData.shoalsLayer)
      }
      let points = [[124, 30], [126, 32], [128, 28], [0, 0], [-4, -4], [54, -20], [80, -50], [20, 35]
        ,[-120, 0], [-120, -3], [-140, 40], [-126, 20], [-52, 20], [-100, 10], [-40, 8],
        [-42, -30]
      ].filter(v => Math.random() > 0.4)
      unReactiveData.shoalsLayer = new Vector({
        source: new SourceVector({
          features: points.map(point => {
            let feature = new Feature({
              geometry: new Point(proj.fromLonLat(point))
            })
            feature.setStyle(Math.random() > 0.5 ? unReactiveData.fishIconStyle : unReactiveData.sleeveFishIconStyle)
            return feature
          })
        })
      })

      // unReactiveData.map.addLayer(unReactiveData.shoalsLayer)


      this.$http.get('/json/fish/fish-2018-8-1.json', {
        baseURL: ''
      }).then(data => {
        const GeoJSON = ol.format.GeoJSON
        const Heatmap = ol.layer.Heatmap
        unReactiveData.map.addLayer(new Heatmap({
          source: new SourceVector({
            features: new GeoJSON().readFeatures(data, {
              dataProjection : 'EPSG:4326',
              featureProjection : 'EPSG:3857'
            })
          })
        }))
        console.log(data)
      })


    },
    // 全局的时间变化
    globalTimeChange (times) {
      console.log(times)
      this.drawShoals()
    }
  }
}
//'/shipStatus/shipStatusList'
</script>

<style lang="less">
	.map {
		width: 100%;
		height:100%;
	}
</style>
