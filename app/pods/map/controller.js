import Ember from 'ember';

export default Ember.Controller.extend({

    locationshare: Ember.inject.service(),

    actions: {
        transitionToSettings: function () {
            this.set("leftSideBarOpen", false);
            this.transitionToRoute('settings');
        },
        transitionToProfile: function () {
            this.set("leftSideBarOpen", false);
            this.transitionToRoute('profile');
        },
        toggleShare: function () {
            this.set("leftSideBarOpen", false);
            this.get('locationshare').toggleProperty('enabled');
        }
    }

});
