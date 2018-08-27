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
import LineString from 'ol/geom/linestring'

// http://openlayers.org/en/latest/examples/icon-color.html


export default {
	data () {
		return {
			msg: ''
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
    
    this.iconStyle = new Style({
      image: new Icon({
        crossOrigin: 'anonymous',
        src: '/static/ship.png'
      })
    })
    this.shipIcon = new Feature({
      geometry: new Point(proj.fromLonLat([120, 30]))
    })
    this.shipIcon.setStyle(this.iconStyle)
    let source = new SourceVector({
      features: [
        this.shipIcon
      ]
    })
    let layer = new Vector({
      source
    })
    this.map.addLayer(layer)

    // this.drawLine()
  },
  methods: {
    drawLine () {
      let points = [ [-89.8802, 32.5804], [25.4286, 46.9235] ].map(v => proj.fromLonLat(v))
      const triangle = new LineString(points);
      let layer = new Vector({
        source: new SourceVector({
          features: [
            new Feature(triangle)
          ]
        })
      })
      this.map.addLayer(layer)
      let startLon = 26
      let startLat = 47
      // console.log(layer.getSource().forEachFeature(f => {
      //   // console.log(f)
      //   f = new LineString(points)
      // }))
      console.log(layer)
      setInterval(() => {
        points.push(proj.fromLonLat([startLon++, startLat++]))
        // layer.getSource()
        layer.setSource(new SourceVector({
          features: [
            new Feature(new LineString(points))
          ]
        }))
      }, 500)
    },
    
  }
}
//'/shipStatus/shipStatusList'
</script>

<style lang="less">
	.map {
		width: 100%;
	}
</style>
