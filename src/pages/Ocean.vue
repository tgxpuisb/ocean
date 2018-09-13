<template>
    <div class="map-container">
      <div id="map" class="map"></div>
      <div class="switch-box">
        <div class="trafficopt">
            <img src="/static/box1.png" style="vertical-align: text-bottom;"/>
            <span>测距</span>
        </div>
        <div class="trafficopt">
            <img src="/static/box2.png" style="vertical-align: text-bottom;" />
            <span>比例尺</span>
        </div>
        <div class="trafficopt">
            <img src="/static/box3.png" style="vertical-align: text-bottom;" />
            <span>标注</span>
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
	JSONLayerZIndex: 1000,
	graticule: null
}

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
				})
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
		
		// axios.get('/json/oil/data-2018-8-1.json').then(res => {
		// 	// if (res.data) {
		// 	// 	let wind = new WindLayer(res.data, {
		// 	// 		projection: 'EPSG:3857',
		// 	// 		ratio: 1
		// 	// 	})
		// 	// 	wind.appendTo(unReactiveData.map)
		// 	// }
		// })

		
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
			// var graticule = new Graticule({
			// 	// the style to use for the lines, optional.
			// 	map: unReactiveData.map
			// 	// showLabels: true
			// })
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
</style>
