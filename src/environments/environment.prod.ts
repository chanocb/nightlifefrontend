import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST: 'https://nightlifebackend-latest.onrender.com',
};