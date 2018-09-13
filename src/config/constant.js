export const LayerConfig = {
  chla: {
    url: [
      '/geo/chla/wms?service=WMS&version=1.1.0&request=GetMap&layers=chla:chla2016-01-01&styles=&bbox=-180.025,-65.025,180.025,65.025&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/chla/wms?service=WMS&version=1.1.0&request=GetMap&layers=chla:chla-2016-01-02&styles=&bbox=-180.025,-65.025,180.025,65.025&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/chla/wms?service=WMS&version=1.1.0&request=GetMap&layers=chla:chla-2016-01-03&styles=&bbox=-180.025,-65.025,180.025,65.025&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2'
    ],
    type: 'tile',
    name: '叶绿素'
  },
  gfs: {
    url: [
      '/json/gfs/gfs-2016-01-01(00).json',
      '/json/gfs/gfs-2016-01-01(12).json',
      '/json/gfs/gfs-2016-01-01(24).json'
    ],
    type: 'json',
    name: '大气数据',
  },
  sst: {
    url: [
      '/geo/sst/wms?service=WMS&version=1.1.0&request=GetMap&layers=sst:sst-2016-01-01&styles=&bbox=-179.99999694739424,-79.99999694633365,179.99999694739424,79.99999694633365&width=768&height=341&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/sst/wms?service=WMS&version=1.1.0&request=GetMap&layers=sst:sst-2016-01-02&styles=&bbox=-179.99999694739424,-79.99999694633365,179.99999694739424,79.99999694633365&width=768&height=341&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/sst/wms?service=WMS&version=1.1.0&request=GetMap&layers=sst:sst-2016-01-03&styles=&bbox=-179.99999694739424,-79.99999694633365,179.99999694739424,79.99999694633365&width=768&height=341&srs=EPSG:4326&format=application%2Fopenlayers2'
    ],
    type: 'tile',
    name: '表温'
  },
  ssta: {
    name: '表温距平值'
  },
  ssh: {
    url: [
      '/geo/ssh/wms?service=WMS&version=1.1.0&request=GetMap&layers=ssh:ssh-2016-01-01&styles=&bbox=-180.125,-65.125,180.125,64.625&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/ssh/wms?service=WMS&version=1.1.0&request=GetMap&layers=ssh:ssh-2016-01-02&styles=&bbox=-180.125,-65.125,180.125,64.625&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/ssh/wms?service=WMS&version=1.1.0&request=GetMap&layers=ssh:ssh-2016-01-03&styles=&bbox=-180.125,-65.125,180.125,64.625&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2'
    ],
    type: 'tile',
    name: '海平面高度'
  },
  ssha: {
    url: [
      '/geo/ssha/wms?service=WMS&version=1.1.0&request=GetMap&layers=ssha:ssha-2016-08-01&styles=&bbox=0.0,-90.0,360.0,90.0&width=768&height=384&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/ssha/wms?service=WMS&version=1.1.0&request=GetMap&layers=ssha:ssha-2016-08-02&styles=&bbox=0.0,-90.0,360.0,90.0&width=768&height=384&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/ssha/wms?service=WMS&version=1.1.0&request=GetMap&layers=ssha:ssha-2016-08-03&styles=&bbox=0.0,-90.0,360.0,90.0&width=768&height=384&srs=EPSG:4326&format=application%2Fopenlayers2'
    ],
    type: 'tile',
    name: '海平面高度距平值'
  },
  sf: {
    url: [
      '/geo/sf/wms?service=WMS&version=1.1.0&request=GetMap&layers=sf:sf-2016-01-01&styles=&bbox=-180.125,-65.125,180.125,64.625&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/sf/wms?service=WMS&version=1.1.0&request=GetMap&layers=sf:sf-2016-01-02&styles=&bbox=-180.125,-65.125,180.125,64.625&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2',
      '/geo/sf/wms?service=WMS&version=1.1.0&request=GetMap&layers=sf:sf-2016-01-03&styles=&bbox=-180.125,-65.125,180.125,64.625&width=768&height=330&srs=EPSG:4326&format=application%2Fopenlayers2'
    ],
    type: 'tile',
    name: '盐度'
  },
  oil: {
    url: [
      '/json/oil/data-2018-8-1.json',
      '/json/oil/data-2018-9-1.json',
      '/json/oil/data-2018-10-1.json'
    ],
    type: 'json',
    name: '原油扩散'
  },
  fish: {
    url: [
      '/json/fish/fish-2018-8-1.json',
      '/json/fish/fish-2018-9-1.json',
      '/json/fish/fish-2018-10-1.json'
    ],
    name: '鱼群分布'
  }
}