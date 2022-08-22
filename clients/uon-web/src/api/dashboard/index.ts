import axios from 'axios';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import type {
  ICarbonReport,
  IDashboardBlockSummary,
  ISiteData,
} from './TEMPORARY';
import type { HistoryQuery } from '../../components/HistoryQueryForm';

async function fetch7DaysTotalCarbon(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/carbon`,
  );
  return data;
}

export const use7DaysTotalCarbon = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['7DaysTotalCarbon'],
    () => fetch7DaysTotalCarbon(),
    {
      staleTime: Infinity,
    },
  );

  return useQueryResult;
};

async function fetchCarbonFromTruckedDiesel(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/diesel`,
  );
  return data;
}

export const useCarbonFromTruckedDiesel = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['CarbonFromTruckedDiesel'],
    () => fetchCarbonFromTruckedDiesel(),
    {
      staleTime: Infinity,
    },
  );

  return useQueryResult;
};

async function fetchCO2perLWaterPumped(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/co2`,
  );
  return data;
}

export const useCO2perLWaterPumped = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['CO2perLWaterPumped'],
    () => fetchCO2perLWaterPumped(),
    {
      staleTime: Infinity,
    },
  );

  return useQueryResult;
};

async function fetch7DaysTotalWaterPumped(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/water`,
  );
  return data;
}

export const use7DaysTotalWaterPumped = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['7DaysTotalWaterPumped'],
    () => fetch7DaysTotalWaterPumped(),
    {
      staleTime: Infinity,
    },
  );

  return useQueryResult;
};

async function fetchAvailableStoredEnergy(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/energy`,
  );
  return data;
}

export const useAvailableStoredEnergy = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['AvailableStoredEnergy'],
    () => fetchAvailableStoredEnergy(),
    {
      staleTime: Infinity,
    },
  );

  return useQueryResult;
};

async function fetch7DaysGreenGeneration(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/energy-generation`,
  );
  return data;
}

export const use7DaysGreenGeneration = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['7DaysGreenGeneration'],
    () => fetch7DaysGreenGeneration(),
    {
      staleTime: Infinity,
    },
  );

  return useQueryResult;
};

async function fetch7DaysFossilFuelGeneration(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/fossil-generation`,
  );
  return data;
}

export const use7DaysFossilFuelGeneration = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['7DaysFossilFuelGeneration'],
    () => fetch7DaysFossilFuelGeneration(),
    {
      staleTime: Infinity,
    },
  );

  return useQueryResult;
};

async function fetchSiteMixData(from: Date, to: Date): Promise<ISiteData> {
  const params = { from, to };
  const { data } = await axios.get<ISiteData>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/site`,
    { params },
  );
  return data;
}

type useSiteMixDataReturn = UseQueryResult<ISiteData> & {
  query: HistoryQuery;
  setQuery: Dispatch<SetStateAction<HistoryQuery>>;
};

export const useSiteMixData = (
  startTime: Date,
  endTime: Date,
): useSiteMixDataReturn => {
  const [query, setQuery] = useState<HistoryQuery>({
    dateRange: [startTime, endTime],
  });
  const useQueryResult = useQuery<ISiteData>(
    ['SiteMixData', query],
    () =>
      fetchSiteMixData(query.dateRange[0] as Date, query.dateRange[1] as Date),
    {
      staleTime: Infinity,
    },
  );

  return { query, setQuery, ...useQueryResult };
};

async function fetchCarbonEmission(
  from: Date,
  to: Date,
): Promise<ICarbonReport> {
  const params = { from, to };
  const { data } = await axios.get<ICarbonReport>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/carbon-report`,
    { params },
  );
  return data;
}

export const useCarbonEmission = (
  // startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  // endTime = new Date(),
  startTime = new Date('2022-03-30'),
  endTime = new Date('2022-04-02'),
) => {
  const [query, setQuery] = useState<HistoryQuery>({
    dateRange: [startTime, endTime],
  });

  const useQueryResult = useQuery<ICarbonReport | undefined>(
    ['carbon-report', query],
    () =>
      fetchCarbonEmission(
        query.dateRange[0] as Date,
        query.dateRange[1] as Date,
      ),
    {
      staleTime: Infinity,
    },
  );
  return { query, setQuery, ...useQueryResult };
};
