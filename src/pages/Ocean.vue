<template>
    <div class="map-container">
      <div id="map" class="map"></div>
      <div class="switch-box">
        <div class="trafficopt" @click="startMasure('LineString')">
            <img src="/static/box1.png" style="vertical-align: text-bottom;"/>
            <span>距离测量</span>
        </div>
				<div class="trafficopt" @click="startMasure('Polygon')">
            <img src="/static/box1.png" style="vertical-align: text-bottom;"/>
            <span>面积测量</span>
        </div>
        <div class="trafficopt" @click="showBingMaps">
            <img src="/static/box4.png" style="vertical-align: text-bottom;" />
            <span>卫星地图</span>
        </div>
        <div class="trafficopt">
            <img src="/static/box3.png" style="vertical-align: text-bottom;" />
            <span>取点</span>
        </div>
        <div class="trafficopt" @click="toggleGrid">
            <img src="/static/box5.png" style="vertical-align: text-bottom;" />
            <span>网格</span>
        </div>
      </div>
      <TimeBar :time="time" class="time-bar" @on-time-change="timeChange"/>
      <div class="platform">
        <ul>
          <li v-for="(icon, index) in icons" :key="index">
						<el-tooltip class="item" effect="dark" :content="icon.title" placement="top">
							<button
								class="el-button m-l-0 el-button--primary is-circle"
								@click="handleLayer(icon.type, index)"
								:class="{ active: icon.isShow }"
							>
								<span class="custom-icon" :class="icon.url"></span>
							</button>
						</el-tooltip>
          </li>
        </ul>
      </div>

      <el-row class="more-btn">
        <el-button type="primary" icon="el-icon-d-arrow-left" v-if="isShow" circle @click="doOpen()"></el-button>
      </el-row>
      <div class="look-more" v-if="isMore">
        <el-button round size="mini" @click="doClose()" class="m-b">返回</el-button>
        <div
					class="m-t"
					v-for="(icon, index) in iconsRight"
					:key="index"
				>
					<button
						class="el-button m-l-0 el-button--default is-circle"
						@click="handleLayer(icon.type, index)"
						:class="{ active: icon.isShow }"
					>
						<span class="custom-icon" :class="icon.url"></span>
					</button>
          <p>{{ icon.title }}</p>
        </div>
      </div>
    </div>
</template>

<script>
const Map = ol.Map
const Tile = ol.layer.Tile
const OSM = ol.source.OSM
const TileWMS = ol.source.TileWMS
const View = ol.View
const ImageLayer = ol.layer.Image
const ImageWMS = ol.source.ImageWMS
const Graticule = ol.Graticule
const Draw = ol.interaction.Draw
const VectorSource = ol.source.Vector
const VectorLayer = ol.layer.Vector
const LineString = ol.geom.LineString
const Polygon = ol.geom.Polygon
const Overlay = ol.Overlay
const getArea = ol.sphere.getArea
const getLength = ol.sphere.getLength
const unByKey = ol.Observable.unByKey
const CircleStyle = ol.style.Circle
const Fill = ol.style.Fill
const Stroke = ol.style.Stroke
const Style = ol.style.Style

import TimeBar from '@/components/TimeBar'

// 哪些不被数据监听的数据
const masureSource = new VectorSource()
const unReactiveData = {
	map: null,
	chalLayer: null,
	gfsLayer: null,
	sstLayer: null,
	sstaLayer: null,
	sshLayer: null,
	sshaLayer: null,
	sfLayer: null,
	JSONLayerZIndex: 1000,
	tileLayerZindex: 10,
	graticule: null,
	bingLayers: null,
	masure: {
		source: masureSource,
		vector: new VectorLayer({
			source: masureSource,
			zIndex: 9999,
			style: new Style({
				fill: new Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new Stroke({
					color: '#ffcc33',
					width: 2
				}),
				image: new CircleStyle({
					radius: 7,
					fill: new Fill({
						color: '#ffcc33'
					})
				})
			})
		}),
		sketch: undefined,
		helpTooltipElement: undefined,
		helpTooltip: undefined,
		measureTooltipElement: undefined,
		measureTooltip: undefined,
		continuePolygonMsg: '点击继续绘制形状, 双击结束绘制',
		continueLineMsg: '点击继续绘制线段, 双击结束绘制',
		pointerMoveHandler: null,
		draw: null, // 绘制的draw
	}, //测量对象 
}
window.unReactiveData = unReactiveData

ol.source.AMap = function(options){
	var options = options ? options : {};
	var url;
	if(options.mapType == "sat"){
			url ="http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
	}else{
			url = "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}";
	}

	ol.source.XYZ.call(this, {
		crossOrigin: 'anonymous',   //跨域
		cacheSize: options.cacheSize,
		projection: ol.proj.get('EPSG:3857'),
		// urls:urls,
		url:url,
		wrapX: options.wrapX !== undefined ? options.wrapX : true
	});

}

ol.inherits(ol.source.AMap,ol.source.XYZ);

const Layers = {

}

import axios from 'axios'

export default {
	data () {
		return {
			msg: '',
			isShow: true,
			isMore: false,
			form: {
			  address: false,
			  satelliteMap: false,
			  ranging: false,
			  point: false
			},
			time: Date.now(),
			icons: [
				{
				  title:'叶绿素',
          type:'chla',
					url: 'chla',
					layer: 'tile',
          isShow: false,
				},
				{
          title:'大气数据',
          type:'gfs',
					url: 'gfs',
					layer: 'wind',
          isShow: false,
				},
				{
				  title:'表温',
          type:'sst',
					url: 'sst',
					layer: 'tile',
          isShow: false,
				},
				{
				  title:'表温距平值',
          type:'ssta',
					url: 'ssta',
					layer: 'tile',
					isShow: false
				},
				{
          title:'海平面高度',
          type:'ssh',
					url: 'ssh',
					layer: 'tile',
          isShow: false,
				},
				{
          title:'海平面距平值',
          type:'ssha',
					url: 'ssha',
					layer: 'tile',
          isShow: false,
				},
				{
          title:'盐度',
          type:'sf',
					url: 'sf',
					layer: 'tile',
          isShow: false,
				}
			],
			iconsRight: [
				{
					title: '冰层覆盖率',
					type: 'ice',
					url: 'ice',
					isShow: false
				},
				{
					title: '海底矿物分布',
					type: 'mine',
					url: 'mine',
					isShow: false
				},
				{
					title: '位势高度',
					type: 'height',
					url: 'height',
					isShow: false
				},
				{
					title: '洋面风压',
					type: 'wind',
					url: 'wind',
					isShow: false
				},
				{
					title: '水温分布',
					type: 'temp',
					url: 'temp',
					isShow: false
				},
				{
					title: '原油泄漏轨迹预测',
					type: 'oil',
					url: 'oil',
					layer: 'geojson',
					isShow: false
				},
				{
					title: '智能鱼群预测',
					type: 'fish',
					url: 'shoal',
					layer: 'geojson',
					isShow: false
				}
			]
		}
	},
	mounted () {
		unReactiveData.map = new Map({
			layers: [
				new Tile({
					source: new OSM({
						wrapX: false
					})
				}),
				unReactiveData.masure.vector // todo测量的图层
			],
			target: 'map',
			view: new View({
				center: [0, 0],
				zoom: 3,
				minZoom: 3,
				// projection:'EPSG:3857',
				// extent: [extent[0] * 2, extent[1] / 6, extent[2] * 2, extent[3] / 5]
			}),
		})
		unReactiveData.map.on('movestart', (data) => {
		})
	},
	methods: {
	  //查看更多
	  doOpen() {
	    console.log(1);
	    this.isShow = false;
	    this.isMore = true;
	  },
	  doClose() {
	    this.isShow = true;
      this.isMore = false;
	  },

		timeChange (time) {
			console.log(time)
		},

		toggleGrid () {
			if (this.hasGraticule) {
				this.hasGraticule = false
				unReactiveData.graticule.setMap(null)
			} else {
				this.hasGraticule = true
				unReactiveData.graticule = new Graticule({
					showLabels: true
				})
				unReactiveData.graticule.setMap(unReactiveData.map)
			}
		},

		showBingMaps () {
			if (unReactiveData.bingLayers) {
				unReactiveData.map.removeLayer(unReactiveData.bingLayers)
				unReactiveData.bingLayers = null
			} else {
				unReactiveData.bingLayers = new Tile({
					title: '高德卫星地图',
					zIndex: 2,
					source: new ol.source.AMap({
						mapType: 'sat',
						wrapX: false
					}),
				})
				unReactiveData.map.addLayer(unReactiveData.bingLayers)
			}
		},

		// 风layer
		genWindLayer () {
			let layer = this.createTileLayer({
				url: 'http://116.62.237.253:8080/geo/wind/wms?service=WMS&version=1.1.0&request=GetMap&layers=wind:windField&styles=yangliu&bbox=-180.25,-90.25000762939453,179.75,90.24999237060547&width=768&height=385&srs=EPSG:4326&format=application/openlayers'
			})
			layer.setZIndex(unReactiveData.JSONLayerZIndex++)
			unReactiveData.map.addLayer(layer)
		},

		handleLayer (type, index) {
			if (unReactiveData[type + 'Layer']) {
				// 如果图层已经存在,则移除
				unReactiveData.map.removeLayer(unReactiveData[type + 'Layer'])
				unReactiveData[type + 'Layer'] = null
				this.icons[index].isShow = false
			} else {
				this.getLayerURL({
					type,
					date: '2016-01-01'
				}).then(response => {
					console.log(response)
					if (response.code == 0 && response.data) {
						let layer
						if (response.data.type === 'gfs') {
							this
								.createJSONLayer(response.data)
								.then(layer => {
									console.log(layer)
									layer.appendTo(unReactiveData.map)
									unReactiveData[type + 'Layer'] = layer
									this.icons[index].isShow = true
								})
						} else {
							// todo 创建了tileLayer的时候,如果有JSONlayer则JSONlayer要提前
							layer = this.createTileLayer(response.data)
							unReactiveData.map.addLayer(layer)
							unReactiveData[type + 'Layer'] = layer
							this.icons[index].isShow = true
							console.log(unReactiveData.map.getLayers())
						}
					}
				})
			}
		},
		getLayerURL (data) {
			return this.$http.post('/serviceUrl/getServiceUrl', data)
		},
		createTileLayer (data) {
			return new Tile({
				source: new TileWMS({
					url: data.url,
					params: {
						LAYERS: data.layers,
						STYLES: data.styles,
						TILED: true
					},
					serverType: 'geoserver',
					wrapX: false
				}),
				zIndex: unReactiveData.tileLayerZindex++
			})
		},
		createJSONLayer (data) {
			return this
				.$http
				.get(data.url, {
					baseURL: undefined
				})
				.then(body => {
					console.log(body)
					return Promise.resolve(
						new WindLayer(body, {
							projection: 'EPSG:3857',
							ratio: 1,
							zIndex: unReactiveData.JSONLayerZIndex++
						})
					)
				})
		},
		// 生成大气数据
		createGFSLayer (data) {
			return this
				.$http
				.get(data.url, {
					baseURL: undefined
				})
				.then(body => {
					console.log(body)
					return Promise.resolve(
						new WindLayer(body, {
							projection: 'EPSG:3857',
							ratio: 1,
							zIndex: unReactiveData.JSONLayerZIndex++
						})
					)
				})
		},
		// masure
		/**
		 * 开始masure的时候先设置type addInteraction 一个draw, 结束绘制之后 removeInteraction
		 */
		startMasure (type) {
			console.log(type)
			unReactiveData.masure.draw = new Draw({
				source: unReactiveData.masure.source,
				type,
				style: new Style({
					fill: new Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new Stroke({
						color: 'rgba(0, 0, 0, 0.5)',
						lineDash: [10, 10],
						width: 2
					}),
					image: new CircleStyle({
						radius: 5,
						stroke: new Stroke({
							color: 'rgba(0, 0, 0, 0.7)'
						}),
						fill: new Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						})
					})
				})
			})
			unReactiveData.map.addInteraction(unReactiveData.masure.draw)

			this.createMeasureTooltip()
			this.createHelpTooltip()

			let listener
			unReactiveData.masure.draw.on('drawstart', evt => {
				unReactiveData.masure.sketch = evt.feature
				let tooltipCoord = evt.coordinate
				listener = unReactiveData.masure.sketch.getGeometry().on('change', evt => {
					let geom = evt.target
					let output
					if (geom instanceof Polygon) {
						output = this.formatArea(geom)
						tooltipCoord = geom.getInteriorPoint().getCoordinates()
					} else if (geom instanceof LineString) {
						output = this.formatLength(geom)
						tooltipCoord = geom.getLastCoordinate()
					}
					console.log(tooltipCoord)
					unReactiveData.masure.measureTooltipElement.innerHTML = output
					unReactiveData.masure.measureTooltip.setPosition(tooltipCoord)
				})
			})
			unReactiveData.masure.draw.on('drawend', () => {
				unReactiveData.masure.measureTooltipElement.className = 'tooltip tooltip-static'
				unReactiveData.masure.measureTooltip.setOffset([0, -7])
				unReactiveData.masure.sketch = null
				unReactiveData.masure.measureTooltipElement = null
				this.createMeasureTooltip()
				unByKey(listener)
			})
			this.initMapDrawEvent()
		},
		initMapDrawEvent () {
			unReactiveData.map.on('pointermove', evt => {
				if (evt.dragging) {
					return
				}
				let helpMsg = 'Click to start drawing'

				if (unReactiveData.masure.sketch) {
					let geom = unReactiveData.masure.sketch.getGeometry()

					unReactiveData.masure.helpTooltipElement.innerHTML = helpMsg
					unReactiveData.masure.helpTooltip.setPosition(evt.coordinate)
					unReactiveData.masure.helpTooltipElement.classList.remove('hidden')
				}
			})
		},
		endMasure () {
			if (unReactiveData.masureDraw) {
				unReactiveData.map.removeInteraction(unReactiveData.masure.draw)
				unReactiveData.masure.draw = null
			}
		},
		createMeasureTooltip () {
			if (unReactiveData.masure.measureTooltipElement) {
				unReactiveData.masure.measureTooltipElement.parentNode.removeChild(unReactiveData.masure.measureTooltipElement)
				// unReactiveData.masure.measureTooltipElement = undefined
			}
			unReactiveData.masure.measureTooltipElement = document.createElement('div')
			unReactiveData.masure.measureTooltipElement.className = 'tooltip tooltip-measure'
			unReactiveData.masure.measureTooltip = new Overlay({
				element: unReactiveData.masure.measureTooltipElement,
				offset: [0, -15],
        positioning: 'bottom-center'
			})
			unReactiveData.map.addOverlay(unReactiveData.masure.measureTooltip)
		},
		createHelpTooltip () {
			if (unReactiveData.masure.helpTooltipElement) {
				unReactiveData.masure.helpTooltipElement.parentNode.removeChild(unReactiveData.masure.helpTooltipElement);
				// unReactiveData.masure.helpTooltipElement = undefined
			}
			unReactiveData.masure.helpTooltipElement = document.createElement('div')
			unReactiveData.masure.helpTooltipElement.className = 'tooltip tooltip-measure'
			unReactiveData.masure.helpTooltip = new Overlay({
				element: unReactiveData.masure.helpTooltipElement,
				offset: [0, -15],
        positioning: 'bottom-center'
			})
			// unReactiveData.map.addOverlay(unReactiveData.masure.helpTooltip)
		},
		formatLength (line) {
			var length = getLength(line)
			var output
			if (length > 100) {
				output = (Math.round(length / 1000 * 100) / 100) +
						' ' + 'km'
			} else {
				output = (Math.round(length * 100) / 100) +
						' ' + 'm'
			}
			return output
		},
		formatArea (polygon) {
			var area = getArea(polygon)
			var output
			if (area > 10000) {
				output = (Math.round(area / 1000000 * 100) / 100) +
						' ' + 'km<sup>2</sup>'
			} else {
				output = (Math.round(area * 100) / 100) +
						' ' + 'm<sup>2</sup>'
			}
			return output
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
		height:100%;
	}
	.time-bar {
		position: absolute;
		bottom: 4em;
		left: 50%;
		transform: translateX(-50%);
	}
	.switch-box{
	  position: absolute;
	  left:0.5em;
	  top:0.5em;
	  z-index:4;
	  height: 34px;
    background: #fff;
    padding: 0 10px;
    border-radius: 0 2px 2px 0;
    box-shadow: 1px 2px 1px rgba(0,0,0,.15);
    .trafficopt {
      padding-right: 15px;
      line-height: 34px;
      float: left;
      font-size:12px;
      display: inline-block;
      cursor: pointer;
      &:last-child{
        padding-right:0
      }
      &:hover{
        color:rgb(64, 158, 255);
      }
    }
    .traffic {
        float: left;
        font-size: 12px;
        font-style: normal;
        height: 34px;
        line-height: 34px;
        display: inline-block;
    }
	}
	.platform {
    position: absolute;
    bottom:0px;
    left:50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.15);
    width:80%;
    padding:10px 0;
    border-radius:8px;
    > ul {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
    li {
      width: 40px;
      height: 40px;
    }
	}

	// 自定义图标
	.custom-icon {
		display: block;
		padding: 7px;
		background-size: 14px 14px;
		&.ice {
			background-image: url("/static/ice.png");
		}
		&.oil {
			background-image: url("/static/oil.png");
		}
		&.height {
			background-image: url("/static/height.png");
		}
		&.temp {
			background-image: url("/static/temp.png");
		}
		&.mine {
			background-image: url("/static/mine.png");
		}
		&.wind {
			background-image: url("/static/wind.png");
		}
		&.shoal {
			background-image: url("/static/shoal.png");
		}
		&.sf {
      background-image: url("/static/icon7.png");
    }
    &.gfs {
      background-image: url("/static/icon1.png");
    }
    &.ssh {
      background-image: url("/static/icon2.png");
    }
    &.sst {
      background-image: url("/static/icon3.png");
    }
    &.ssha {
      background-image: url("/static/icon4.png");
    }
    &.ssta {
      background-image: url("/static/icon5.png");
    }
    &.chla {
      background-image: url("/static/icon6.png");
    }
	}
	.tooltip {
		position: relative;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 4px;
		color: white;
		padding: 4px 8px;
		opacity: 0.7;
		white-space: nowrap;
	}
	.tooltip-measure {
		opacity: 1;
		font-weight: bold;
	}
	.tooltip-static {
		background-color: #ffcc33;
		color: black;
		border: 1px solid white;
	}
	.tooltip-measure:before,
	.tooltip-static:before {
		border-top: 6px solid rgba(0, 0, 0, 0.5);
		border-right: 6px solid transparent;
		border-left: 6px solid transparent;
		content: "";
		position: absolute;
		bottom: -6px;
		margin-left: -7px;
		left: 50%;
	}
	.tooltip-static:before {
		border-top-color: #ffcc33;
	}
</style>
