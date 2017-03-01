import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
    geolocation: Ember.inject.service(),
    enabled: false,

    updateLocation: Ember.observer( "enabled", function (){
        console.log(this.get("enabled"));
        if(this.get("enabled")){
            console.log("share enabled");
            this._loopItem = Ember.run.later(this, () => {
                console.log("start loop");
                this.updatePosition();
            }, 2000);
            this.set("_loopItem",this._loopItem);
        } else {
            this._loopItem = this.get("_loopItem");
            Ember.run.cancel(this._loopItem);
        }
    }),

    updatePosition: function() {
        let self = this;
        this._loopItem = Ember.run.later(this, () => {
            console.log("loop iteartion");
            this.get('geolocation').getLocation().then(function(geoObject) {
                console.log(geoObject.coords);
                self.saveLocation(geoObject.coords);
            });

            this.updatePosition();
        }, 2000);

        this.set("_loopItem", this._loopItem);
    },

    saveLocation: function(coords) {
        let data = {
            user: "Ville",
            loc: [coords.longitude, coords.latitude],
            date: moment().format()
        };
        $.post( config.APP.API_URL+"locations", data)
            .done (function( result ) {
                console.log(result);
            });
    }

});
