/**
 * @type {import('@tymlez/client-tools/src/bootstrap/IBootstrap').IBootstrap}
 */
const bootstrap = {
  client_detail: {
    name: 'cohort',
    label: 'Cohort',
  },
  site_details: {
    main: {
      name: 'main',
      label: 'Main Site',
      address: '16 Nexus Way, Southport QLD 4215',
      lat: -27.9624495,
      lng: 153.3817313,
      has_solar: true,
      region: 'QLD1',
      solcast_resource_id: '6587-6532-5132-b217',
      solar_details: {
        'cohort-solcast-forecasted': {
          name: 'cohort-solcast-forecasted',
          label: 'Forecasted Solar from Solcast',
          meter_id: '',
          ac_capacity: 0.11,
          dc_capacity: 0.1,
          tracking: 'fixed',
          inverter_url: '',
        },
      },
      meter_details: {
        'meter-1': {
          name: 'meter-1',
          meter_id: 'D6495267623',
          label: '1. Main',
          description: 'Main income supply (1x A3RM)',
          lat: -27.9624495,
          lng: 153.3817313,
          type: 'ww',
          interval: 300,
          isMain: true,
          status: 'online',
          circuit_details: [
            {
              name: 'main',
              label: 'Main Circuit',
            },
          ],
          channel_details: [
            {
              label: 'Main Phase 1',
              circuit_name: 'main',
            },
            {
              label: 'Main Phase 2',
              circuit_name: 'main',
            },
            {
              label: 'Main Phase 3',
              circuit_name: 'main',
            },
          ],
        },
        'meter-2': {
          name: 'meter-2',
          meter_id: 'ED255CC1AF414',
          label: '2. TER and T1',
          description: 'Main income supply (1x A3RM)',
          lat: -27.9624495,
          lng: 153.3817313,
          type: 'ww',
          interval: 300,
          status: 'offline',
          circuit_details: [
            {
              name: 'ter',
              label: 'TER Circuit',
            },
            {
              name: 't1',
              label: 'T1 Circuit',
            },
          ],
          channel_details: [
            {
              label: 'TER Phase 1',
              circuit_name: 'ter',
            },
            {
              label: 'TER Phase 2',
              circuit_name: 'ter',
            },
            {
              label: 'TER Phase 3',
              circuit_name: 'ter',
            },
            {
              label: 'T1 Phase 1',
              circuit_name: 't1',
            },
            {
              label: 'T1 Phase 2',
              circuit_name: 't1',
            },
            {
              label: 'T1 Phase 3',
              circuit_name: 't1',
            },
          ],
        },
        'meter-9': {
          name: 'meter-9',
          meter_id: 'ED255CC1AF414',
          label: '2. TER and T1',
          description: 'Main income supply (1x A3RM)',
          lat: -27.9624495,
          lng: 153.3817313,
          type: 'ww',
          interval: 300,
          status: 'offline',
          circuit_details: [
            {
              name: 'ter',
              label: 'TER Circuit',
            },
            {
              name: 't1',
              label: 'T1 Circuit',
            },
          ],
          channel_details: [
            {
              label: 'TER Phase 1',
              circuit_name: 'ter',
            },
            {
              label: 'TER Phase 2',
              circuit_name: 'ter',
            },
            {
              label: 'TER Phase 3',
              circuit_name: 'ter',
            },
            {
              label: 'T1 Phase 1',
              circuit_name: 't1',
            },
            {
              label: 'T1 Phase 2',
              circuit_name: 't1',
            },
            {
              label: 'T1 Phase 3',
              circuit_name: 't1',
            },
          ],
        },
      },
    },
  },
  user_details: {
    'admin@cohort.com': {
      email: 'admin@cohort.com',
      roles: ['admin'],
    },
  },
  secrets_hash: 'xxx',
};

module.exports = bootstrap;
