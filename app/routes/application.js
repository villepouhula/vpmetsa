import Ember from 'ember';

export default Ember.Route.extend({
    fb: Ember.inject.service(),
    beforeModel() {
        this.get('fb').FBInit();
        window.loginFinished = () => {
            this.controllerFor('application').checkLoginStatus();
        };
    }
});
