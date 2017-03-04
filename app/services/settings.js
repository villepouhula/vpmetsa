import Ember from 'ember';

export default Ember.Service.extend({
    map_tile_url: 'https://{s}.kapsi.fi/mapcache/peruskartta_3067/{z}/{x}/{y}.png',
    map_tile_url: 'https://{s}.kapsi.fi/mapcache/taustakartta_3067/{z}/{x}/{y}.png',
    use_mml_maps: true
});
