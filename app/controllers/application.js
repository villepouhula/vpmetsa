import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
import { v1, v4 } from "ember-uuid";
import config from '../config/environment';

export default Ember.Controller.extend({
    userstorage: storageFor('user'),
    fb: Ember.inject.service(),

    showDialog: Ember.computed("userstorage.userid", function(){
        let self = this;


        // if(!this.get("userstorage.userid")){
        //     return true;
        // }

        if(this.get("userstorage.userid")){
            return false;
        } else {
            this.get('fb').getLoginStatus().then( function(response)  {

                console.log("conn");
                //get userid and name
                if(response.status === "connected"){
                    self.get('fb').api('/me').then(function(me){
                        self.set("userstorage.username", me.name);
                        self.set("userstorage.userid", me.id);
                        self.set("userstorage.fb", true);

                        self.set("showDialog", false);

                        self.transitionToRoute("index");
                    });
                } else {
                    self.set("showDialog", true);
                }
            });

        }

    }),
    checkLoginStatus: function(){
        let self = this;
        this.get('fb').getLoginStatus().then( function(response)  {
            if(response.status === "unknown"){
                self.set("showDialog", true);
            }

            //get userid and name
            if(response.status === "connected"){
                self.get('fb').api('/me').then(function(me){
                    self.set("userstorage.username", me.name);
                    self.set("userstorage.userid", me.id);
                    self.set("userstorage.fb", true);
                    self.set("showDialog", false);

                    self.transitionToRoute("index");

                });
            }
        });
    },
    actions: {

        closePromptDialog: function() {

            if(this.get("name")){
                this.set("userstorage.username", this.get("name"));
                this.set("userstorage.userid", v4());
                this.set("userstorage.fb", false);

                this.set("showDialog", false);
            }
        }
    }
});
