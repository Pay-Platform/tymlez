import axios from 'axios';

import type { ICohortDashboard } from '@tymlez/cohort-api-interfaces';
import { useQuery } from 'react-query';

export function useDashboardOverview() {
  // Create a query with the key `projects`
  return useQuery('dashboard-overview', async () => {
    const { data } = await axios.get<ICohortDashboard>(
      `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard`,
    );

    return data;
  });
}
