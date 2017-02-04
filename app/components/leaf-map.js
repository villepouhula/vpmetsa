import Ember from 'ember';

export default Ember.Component.extend({
    geolocation: Ember.inject.service(),

    lat: 62.732420,
    lng: 29.866032,
    zoom: 13,
    own: [62.732420, 29.866032],

    init: function() {
        this._super();
        let self = this;
        this.get('geolocation').getLocation().then(function(geoObject) {
            self.set("lat", geoObject.coords.latitude);
            self.set("lng", geoObject.coords.longitude);
            self.set("own", [geoObject.coords.latitude, geoObject.coords.longitude])
        });
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


        let map = new L.Map('map', {
            crs: crs,
            continuousWorld: true,
            worldCopyJump: false,
            zoomControl: false
        });

        this.set("map", map);

        let tileUrl = 'https://{s}.kapsi.fi/mapcache/peruskartta_3067/{z}/{x}/{y}.png'
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

        this.get("map").addLayer(tilelayer);
        this.get("map").setView(this.get("own"), this.get("zoom"));
    },

    actions: {
        getPos() {
            let self = this;
            this.get('geolocation').getLocation().then(function(geoObject) {
                self.set("lat", geoObject.coords.latitude);
                self.set("lng", geoObject.coords.longitude);
                self.set("own", [geoObject.coords.latitude, geoObject.coords.longitude])

                self.get("map").setView(self.get("own"), self.get("zoom"));
            });
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
            console.log(e.target.getZoom());
            this.set('lat', center.lat);
            this.set('lng', center.lng);
            this.set('zoom', e.target.getZoom());

            this.findUsersNearby();
        }
    }
});
