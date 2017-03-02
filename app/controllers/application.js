import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
import { v1, v4 } from "ember-uuid";

export default Ember.Controller.extend({
    userstorage: storageFor('user'),

    showDialog: Ember.computed("userstorage.userid", function(){

        if(this.get("userstorage.userid")){
            return false;
        } else {
            return true;
        }

    }),
    actions: {

        closePromptDialog: function() {
            if(this.get("name")){
                this.set("userstorage.username", this.get("name"));
                this.set("userstorage.userid", v4());
            }
        }
    }
});
