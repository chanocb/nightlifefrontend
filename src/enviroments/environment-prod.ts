import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST: 'https://nightlifefrontend-latest.onrender.com',
};