import pkg from '../../package.json';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST: 'http://localhost:8081', //NOSONAR
};