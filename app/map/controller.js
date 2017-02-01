import Ember from 'ember';

export default Ember.Controller.extend({
    geolocation: Ember.inject.service(),

    lat: 62.732420,
    lng: 29.866032,
    zoom: 13,
    own: [62.732420, 29.866032],

    init: function() {
        let self = this;
        this.get('geolocation').getLocation().then(function(geoObject) {
            self.set("lat", geoObject.coords.latitude);
            self.set("lng", geoObject.coords.longitude);
            self.set("own", [geoObject.coords.latitude, geoObject.coords.longitude])
        });
    },

    actions: {
        getPos() {
            let self = this;
            this.get('geolocation').getLocation().then(function(geoObject) {
                self.set("lat", geoObject.coords.latitude);
                self.set("lng", geoObject.coords.longitude);
                self.set("own", [geoObject.coords.latitude, geoObject.coords.longitude])
            });
        },
        zoomIn() {
            this.incrementProperty("zoom");
        },
        zoomOut() {
            this.decrementProperty("zoom");
        },
        updateCenter(e) {
            let center = e.target.getCenter();
            this.set('lat', center.lat);
            this.set('lng', center.lng);
        }
    }
});