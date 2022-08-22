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
      lat: -27.962386703944432,
      lng: 153.38614828454644,
      has_solar: true,
      solcast_resource_id: '6587-6532-5132-b217',
      region: 'QLD1',
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
          meter_id: 'DD54108399431',
          label: 'Main',
          description: 'Main income supply (1x A3RM)',
          lat: -27.962386703944432,
          lng: 153.38614828454644,
          type: 'ww',
          interval: 300,
          isMain: true,
          firstMeterEnergyTimestamp: '2021-12-11T04:40:00.000Z',
          circuit_details: [
            {
              name: 'main',
              label: 'Main',
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
          meter_id: 'DDA4108813784',
          label: 'T8 and T1',
          description: 'Main income supply (1x A3RM)',
          lat: -27.962386703944432,
          lng: 153.38614828454644,
          type: 'ww',
          interval: 300,
          firstMeterEnergyTimestamp: '2021-12-11T04:40:00.000Z',
          circuit_details: [
            {
              name: 't8',
              label: 'T8',
            },
            {
              name: 't1',
              label: 'T1',
            },
          ],
          channel_details: [
            {
              label: 'T8 Phase 1',
              circuit_name: 't8',
            },
            {
              label: 'T8 Phase 2',
              circuit_name: 't8',
            },
            {
              label: 'T8 Phase 3',
              circuit_name: 't8',
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
        'meter-3': {
          name: 'meter-3',
          meter_id: 'DDE4108813923',
          label: 'T2 and T3',
          description: '1x A6M 6x 120 A CT',
          lat: -27.962386703944432,
          lng: 153.38614828454644,
          type: 'ww',
          interval: 300,
          firstMeterEnergyTimestamp: '2021-12-11T04:40:00.000Z',
          circuit_details: [
            {
              name: 't2',
              label: 'T2',
            },
            {
              name: 't3',
              label: 'T3',
            },
          ],
          channel_details: [
            {
              label: 'T2 Phase 1',
              circuit_name: 't2',
            },
            {
              label: 'T2 Phase 2',
              circuit_name: 't2',
            },
            {
              label: 'T2 Phase 3',
              circuit_name: 't2',
            },
            {
              label: 'T3 Phase 1',
              circuit_name: 't3',
            },
            {
              label: 'T3 Phase 2',
              circuit_name: 't3',
            },
            {
              label: 'T3 Phase 3',
              circuit_name: 't3',
            },
          ],
        },
        'meter-4': {
          name: 'meter-4',
          meter_id: 'DDA4108814035',
          label: 'T4 and T5',
          description: '1x A6M 6x 200 A CT',
          lat: -27.962386703944432,
          lng: 153.38614828454644,
          type: 'ww',
          interval: 300,
          firstMeterEnergyTimestamp: '2021-12-11T04:40:00.000Z',
          circuit_details: [
            {
              name: 't4',
              label: 'T4',
            },
            {
              name: 't5',
              label: 'T5',
            },
          ],
          channel_details: [
            {
              label: 'T5 Phase 1',
              circuit_name: 't5',
            },
            {
              label: 'T5 Phase 2',
              circuit_name: 't5',
            },
            {
              label: 'T5 Phase 3',
              circuit_name: 't5',
            },
            {
              label: 'T4 Phase 1',
              circuit_name: 't4',
            },
            {
              label: 'T4 Phase 2',
              circuit_name: 't4',
            },
            {
              label: 'T4 Phase 3',
              circuit_name: 't4',
            },
          ],
        },
        'meter-5': {
          name: 'meter-5',
          meter_id: 'DDC4108814545',
          label: 'T6 and T7',
          description: '1x A6M 6x 200 A CT',
          lat: -27.962386703944432,
          lng: 153.38614828454644,
          type: 'ww',
          interval: 300,
          firstMeterEnergyTimestamp: '2021-12-11T04:40:00.000Z',
          circuit_details: [
            {
              name: 't6',
              label: 'T6',
            },
            {
              name: 't7',
              label: 'T7',
            },
          ],
          channel_details: [
            {
              label: 'T6 Phase 1',
              circuit_name: 't6',
            },
            {
              label: 'T6 Phase 2',
              circuit_name: 't6',
            },
            {
              label: 'T6 Phase 3',
              circuit_name: 't6',
            },
            {
              label: 'T7 Phase 1',
              circuit_name: 't7',
            },
            {
              label: 'T7 Phase 2',
              circuit_name: 't7',
            },
            {
              label: 'T7 Phase 3',
              circuit_name: 't7',
            },
          ],
        },
        'meter-6': {
          name: 'meter-6',
          meter_id: 'DDF4108813619',
          label: 'Communal',
          description: '1x A6M 6x 400 A CT',
          lat: -27.962386703944432,
          lng: 153.38614828454644,
          type: 'ww',
          interval: 300,
          firstMeterEnergyTimestamp: '2021-12-11T04:40:00.000Z',
          circuit_details: [
            {
              name: 'communal',
              label: 'Communal',
            },
          ],
          channel_details: [
            {
              label: 'Communal Phase 1',
              circuit_name: 'communal',
              index_override: 3,
            },
            {
              label: 'Communal Phase 2',
              circuit_name: 'communal',
              index_override: 4,
            },
            {
              label: 'Communal Phase 3',
              circuit_name: 'communal',
              index_override: 5,
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
    'cohort.staff1@cohort.com': {
      email: 'cohort.staff1@cohort.com',
      roles: ['cohort-staff'],
    },
    'qld.gov.staff1@cohort.com': {
      email: 'qld.gov.staff1@cohort.com',
      roles: ['qld-government-staff'],
    },
    'display@cohort.com': {
      email: 'display@cohort.com',
      roles: ['permanent-display'],
    },
  },
  secrets_hash: 'dd4aae3bc9a77141f5a2633196cbbc72',
};

module.exports = bootstrap;
