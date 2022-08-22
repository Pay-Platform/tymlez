import axios from 'axios';
import { getSites } from './sites';

jest.mock('axios');
// TODO: fix this jest mock issue
describe.skip('getSites', () => {
  it('should get sites from the correct URL', async () => {
    jest.clearAllMocks();

    const request = axios.request as jest.Mock;
    request.mockReturnValue({ data: 'data' });

    await getSites({
      platformApiHost: 'localhost:1234',
      authorizationHeader: 'Bearer 1234',
    });

    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "http://localhost:1234/api/sites/cohort",
        Object {
          "headers": Object {
            "Authorization": "Bearer 1234",
          },
        },
      ]
    `);
  });
});
