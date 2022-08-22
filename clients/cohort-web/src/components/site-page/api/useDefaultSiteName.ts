import axios from 'axios';
import { useQuery } from 'react-query';
import type { UUID } from '@tymlez/platform-api-interfaces';

export function useDefaultSiteName() {
  return useQuery(
    'site-detail',
    async () => {
      const { data } = await axios.get<UUID>(
        `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/default-site-name`,
      );

      return data;
    },
    {
      staleTime: Infinity,
    },
  );
}
