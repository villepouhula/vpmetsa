export function initialize(application) {
    application.inject('controller', 'fb', 'service:fb');
}

export default {
    name: 'fb',
    initialize
};
