import Ember from 'ember';

export default Ember.Controller.extend({
    locationshare: Ember.inject.service(),
    actions: {
        transitionToSettings: function () {
            this.transitionToRoute('settings');
        },
        transitionToProfile: function () {
            this.transitionToRoute('profile');
        },
        toggleShare: function () {
            this.get('locationshare').toggleProperty('enabled');
        }
    }
});
