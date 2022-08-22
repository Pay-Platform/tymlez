import axios from 'axios';
import type { ICohortSiteDetail } from '@tymlez/cohort-api-interfaces';
import { useQuery } from 'react-query';
import { useDefaultSiteName } from './useDefaultSiteName';

export function useSiteDetail() {
  const { data: defaultSiteName } = useDefaultSiteName();

  return useQuery(
    ['site-detail', defaultSiteName],
    async () => {
      if (defaultSiteName) {
        const { data } = await axios.get<ICohortSiteDetail>(
          `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/site-detail/${defaultSiteName}`,
        );

        localStorage.setItem('region', data.region);

        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );
}
