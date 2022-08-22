/**
 * @type {import('@tymlez/client-tools/src/bootstrap/IBootstrapSecrets').IBootstrapSecrets}
 */
const bootstrapSecrets = {
  site_details: {
    main: {
      solar_details: {
        'solar-1': {
          inverter_key: 'inverter_key 1',
        },
      },
      meter_details: {
        'meter-1': {
          api_key: 'api key 1',
        },
        'meter-2': {
          api_key: 'api key 2',
        },
        'meter-3': {
          api_key: 'api key 3',
        },
      },
    },
  },
  user_details: {
    'admin@tymlez.com': {
      password: 'password 1',
    },
  },
};

module.exports = bootstrapSecrets;
