import Ember from 'ember';

export default Ember.Controller.extend({
    geolocation: Ember.inject.service(),

    lat: 62.732420,
    lng: 29.866032,
    zoom: 13,
    own: [62.732420, 29.866032],
    subdomains: ['tile1', 'tile2'],
    // crs: L.CRS.Simple,
    // crs: new L.Proj.CRS.TMS('EPSG:3067',
    //     '+proj=utm +zone=35 +ellps=GRS80 +units=m +towgs84=0,0,0,-0,-0,-0,0 +no_defs',
    //     [-548576.0, 6291456.0, 1548576.0, 8388608],
    //     {
    //         resolutions: [
    //             8192,
    //             4096,
    //             2048,
    //             1024,
    //             512,
    //             256,
    //             128,
    //             64,
    //             32,
    //             16,
    //             8,
    //             4,
    //             2,
    //             1,
    //             0.5,
    //             0.25
    //         ]
    //     }
    // ),

    init: function() {
        let self = this;
        this.get('geolocation').getLocation().then(function(geoObject) {
            self.set("lat", geoObject.coords.latitude);
            self.set("lng", geoObject.coords.longitude);
            self.set("own", [geoObject.coords.latitude, geoObject.coords.longitude])
        });
    },

    findUsersNearby: function() {
        console.log("finding users..");
        console.log("lat:" +this.get("lat"));
        console.log("lng:" +this.get("lng"));
        console.log("zoom:" +this.get("zoom"));
    },


});
