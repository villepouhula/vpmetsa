import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
    geolocation: Ember.inject.service(),
    locationshare: Ember.inject.service(),
    settings: Ember.inject.service(),

    lat: 62.7660262,
    lng: 29.8923715,
    zoom: 13,
    own: [62.7660262, 29.8923715],

    init: function() {
        this._super();
        let self = this;
        this.get('geolocation').getLocation().then(function(geoObject) {
            self.set("lat", geoObject.coords.latitude);
            self.set("lng", geoObject.coords.longitude);
            self.set("own", [geoObject.coords.latitude, geoObject.coords.longitude]);

        });

        L.Icon.Default.imagePath = 'img/leaflet';

    },

    didInsertElement: function() {
        let crs = new L.Proj.CRS.TMS('EPSG:3067',
            '+proj=utm +zone=35 +ellps=GRS80 +units=m +towgs84=0,0,0,-0,-0,-0,0 +no_defs',
            [-548576.0, 6291456.0, 1548576.0, 8388608],
            {
                resolutions: [
                    8192,
                    4096,
                    2048,
                    1024,
                    512,
                    256,
                    128,
                    64,
                    32,
                    16,
                    8,
                    4,
                    2,
                    1,
                    0.5,
                    0.25
                ]
            });


        // let map = new L.Map('map', {
        //     crs: crs,
        //     continuousWorld: true,
        //     worldCopyJump: false,
        //     zoomControl: false
        // });

        let map = new L.Map('map',{
            zoomControl: false
        });


        this.set("map", map);

        let tileUrl = 'https://{s}.kapsi.fi/mapcache/peruskartta_3067/{z}/{x}/{y}.png';
        let attrib = '&copy; Karttamateriaali <a href="http://www.maanmittauslaitos.fi/avoindata">Maanmittauslaitos</a>',
            tilelayer = new L.Proj.TileLayer.TMS(tileUrl, crs, {
                maxZoom: 14,
                minZoom: 0,
                tileSize: 256,
                tms: false,
                continuousWorld: true,
                attribution: attrib,
                subdomains: ['tile1','tile2']
            });


        tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
        tileUrl = 'http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg';
        tileUrl = this.get("settings").get("map_tile_url");
        tilelayer = new L.tileLayer(tileUrl);

        let ownIcon = L.icon({
            iconUrl: 'img/leaflet/home-2.png',

            iconSize:     [32, 37], // size of the icon
            iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
        });

        let ownpos = new L.marker(this.get("own"), {icon: ownIcon});
        this.set("own_pos_marker", ownpos);

        this.get("map").addLayer(tilelayer);
        this.get("map").setView(this.get("own"), this.get("zoom"));



        this.get("map").on('zoomend', this.findUsersNearby);
        this.get("map").on('moveend', this.findUsersNearby);

    },

    findUsersNearby: function(e) {

        let data = {
            sw_lat: e.target.getBounds()._southWest.lat,
            sw_lng: e.target.getBounds()._southWest.lng,
            ne_lat: e.target.getBounds()._northEast.lat,
            ne_lng: e.target.getBounds()._northEast.lng
        }

        let self = this;
        let posarr = [];

        let userIcon = L.icon({
            iconUrl: 'img/leaflet/male-2.png',

            iconSize:     [32, 37], // size of the icon
            iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
        });



        Ember.$.get( config.APP.API_URL+"findUsers", data)
            .done (function( result ) {
                if(self.layergroup){
                    self.layergroup.clearLayers();
                }
                result.forEach(function(row) {
                    let latlng = [row.loc[1],row.loc[0]];
                    // console.log(latlng);

                    let marker = new L.marker(latlng, {icon: userIcon});
                    marker.bindTooltip(row.username+"<br />"+moment(row.date).format("DD.MM.YYYY HH:mm"));
                    if(!self.layergroup){
                        posarr.push(marker);
                    } else {
                        self.layergroup.addLayer(marker);
                    }

                });

                if(!self.layergroup){
                    self.layergroup = new L.layerGroup(posarr).addTo(self);
                }


            });
    },

    getPos: function() {
        console.log("update position..");

        this.get("map").addLayer(this.get("own_pos_marker"));

        let self = this;
        this.get('geolocation').getLocation().then(function(geoObject) {
            self.set("lat", geoObject.coords.latitude);
            self.set("lng", geoObject.coords.longitude);
            self.set("own", [geoObject.coords.latitude, geoObject.coords.longitude]);

            self.get("map").setView(self.get("own"), self.get("zoom"));


            self.get("own_pos_marker").setOpacity(100);
            self.get("own_pos_marker").setLatLng([geoObject.coords.latitude, geoObject.coords.longitude]);

            self._posWatcher = Ember.run.later(this, () => {
                console.log("run again");
                self.getPos();
            }, 5000);

            self.set("_posWatcher", self._posWatcher);
        });
    },

    actions: {
        getPos() {
            this.toggleProperty("watchPos");

            if(this.get("watchPos")){
                console.log("start watch");
                this.getPos();
            } else {
                console.log("stop watch");
                Ember.run.cancel(this.get("_posWatcher"));
                this.get("own_pos_marker").setOpacity(0);
            }

        },
        zoomIn() {
            this.incrementProperty("zoom");
            this.get("map").setZoom(this.get("zoom"));
        },
        zoomOut() {
            this.decrementProperty("zoom");
            this.get("map").setZoom(this.get("zoom"));
        },
        updateCenter(e) {
            let center = e.target.getCenter();
            this.set('lat', center.lat);
            this.set('lng', center.lng);
            this.set('zoom', e.target.getZoom());

            this.findUsersNearby();
        }
    }
});
