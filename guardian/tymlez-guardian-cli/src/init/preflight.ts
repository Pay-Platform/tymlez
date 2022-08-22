import axios from 'axios';

export async function preflightCheck({
  GUARDIAN_TYMLEZ_API_KEY,
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
}: {
  GUARDIAN_TYMLEZ_API_KEY: string;
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
}) {
  try {
    console.log('Preflight check');
    const { data } = await axios.get(
      `${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/info`,
      {
        headers: {
          Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
        },
      },
    );
    console.log('Preflight check: OK', data);
  } catch (err) {
    console.error(
      'Tymlez API is not working at ',
      GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    );
    process.exit(1);
  }
}
