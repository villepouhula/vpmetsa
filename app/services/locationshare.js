import Ember from 'ember';
import config from '../config/environment';
import { storageFor } from 'ember-local-storage';

export default Ember.Service.extend({
    geolocation: Ember.inject.service(),
    userstorage: storageFor('user'),
    enabled: false,

    updateLocation: Ember.observer( "enabled", function (){
        if(this.get("enabled")){

            this.positionUpdate();
            this.startUpdateLoop();
        } else {
            this.stopUpdateLoop();
        }
    }),

    startUpdateLoop: function() {

        this._loopItem = Ember.run.later(this, () => {
            this.positionUpdate();
            this.startUpdateLoop();
        }, 60000);

        this.set("_loopItem", this._loopItem);
    },

    positionUpdate: function() {
        let self = this;
        this.get('geolocation').getLocation().then(function(geoObject) {
            self.saveLocation(geoObject.coords);
        });
    },

    stopUpdateLoop: function() {
        Ember.run.cancel(this.get("_loopItem"));
    },

    saveLocation: function(coords) {
        let data = {
            user: this.get("userstorage.userid"),
            username: this.get("userstorage.username"),
            loc: [coords.longitude, coords.latitude],
            date: moment().format()
        };
        $.post( config.APP.API_URL+"locations", data)
            .done (function( result ) {
                console.log(result);
            });
    }

});
