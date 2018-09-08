<template>
	<div class="map-container">
		<div id="map" class="map"></div>
		<TimeBar :time="time" class="time-bar" @on-time-change="timeChange"/>
		<div class="platform">
			<ul>
				<li v-for="(icon, index) in icons" :key="index">
					<img :src="icon.url" :title="icon.title" @click="handleLayer(icon.type, index)" :class="{ active: icon.isShow }">
				</li>
			</ul>
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

import TimeBar from '@/components/TimeBar'

// 哪些不被数据监听的数据
const unReactiveData = {
	map: null,
	chalLayer: null,
	gfsLayer: null,
	sstLayer: null,
	sstaLayer: null,
	sshLayer: null,
	sshaLayer: null,
	sfLayer: null,
	JSONLayerZIndex: 1000
}

import axios from 'axios'

export default {
	data () {
		return {
			msg: '',
			time: Date.now(),
			icons: [
				{
				  title:'叶绿素',
          type:'chla',
					url: '/static/icon_1.png',
          isShow: false,
				},
				{
          title:'大气数据',
          type:'gfs',
					url: '/static/icon_2.png',
          isShow: false,
				},
				{
				  title:'表温',
          type:'sst',
					url: '/static/icon_3.png',
          isShow: false,
				},
				{
				  title:'表温距平值',
          type:'ssta',
					url: '/static/icon_4.png'
				},
				{
          title:'海平面高度',
          type:'ssh',
					url: '/static/icon_5.png',
          isShow: false,
				},
				{
          title:'海平面距平值',
          type:'ssha',
					url: '/static/icon_6.png',
          isShow: false,
				},
				{
          title:'盐度',
          type:'sf',
					url: '/static/icon_7.png',
          isShow: false,
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
				})
			],
			target: 'map',
			view: new View({
				center: [0, 0],
				zoom: 2.4,
				minZoom: 2.4,
				projection:'EPSG:3857',
				// extent: [extent[0] * 2, extent[1] / 6, extent[2] * 2, extent[3] / 5]
			}),
			loadTilesWhileAnimating: true
		})
		unReactiveData.map.on('movestart', (data) => {
			// console.log(data)
		})
		var graticule = new Graticule({
			// the style to use for the lines, optional.
			map: unReactiveData.map
			// showLabels: true
		})
		console.log(graticule)
		// axios.get('/json/oil/data-2018-8-1.json').then(res => {
		// 	console.log(res)
		// 	// if (res.data) {
		// 	// 	let wind = new WindLayer(res.data, {
		// 	// 		projection: 'EPSG:3857',
		// 	// 		ratio: 1
		// 	// 	})
		// 	// 	wind.appendTo(unReactiveData.map)
		// 	// }
		// })
	
		let layer = this.createTileLayer({
			url: 'http://116.62.237.253:8080/geo/wind/wms?service=WMS&version=1.1.0&request=GetMap&layers=wind:windField&styles=yangliu&bbox=-180.25,-90.25000762939453,179.75,90.24999237060547&width=768&height=385&srs=EPSG:4326&format=application/openlayers'
		})
		layer.setZIndex(unReactiveData.JSONLayerZIndex++)
		unReactiveData.map.addLayer(layer)
	},
	methods: {
		timeChange (time) {
			console.log(time)
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
				})
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
			transform-origin: center center;
		}
		.active {
			transform: scale(1.3);
		}
		img:hover {
			transform: scale(1.3);
		}
	}
</style>
