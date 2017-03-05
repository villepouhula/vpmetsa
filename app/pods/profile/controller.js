import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend({
    fb: Ember.inject.service(),

    userstorage: storageFor('user'),


    loggedInFacebook: Ember.computed("userstorage.userid", function(){
        let self = this;

        this.get('fb').getLoginStatus().then( function(response)  {
            if(response.status === "unknown"){
                self.set("loggedInFacebook", false);
            }

            if(response.status === "connected"){
                self.set("loggedInFacebook", true);
            }
        });


    }),

    actions: {
        logOut: function() {
            let self = this;
            //DELETE /{user-id}/permissions

            if(this.get("loggedInFacebook") && this.get("userstorage.fb")){
                this.get('fb').logout().then( function(response)  {

                    self.get("userstorage").clear();
                    self.transitionToRoute("index");
                });
            } else {

                this.get("userstorage").clear();
                this.transitionToRoute("index");
            }


        }
    }


});
