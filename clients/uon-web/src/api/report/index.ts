import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import type { HistoryQuery } from '../../components/HistoryQueryForm';
import type {
  ICarbonAudit,
  ICarbonReport,
  IHookReturnWithPeriod,
} from './TYPE';
import type { IDashboardBlockSummary } from '../dashboard/TEMPORARY';

async function fetchCarbonReport(from: Date, to: Date): Promise<ICarbonReport> {
  const params = { from, to };
  const { data } = await axios.get<ICarbonReport>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/carbon-report`,
    { params },
  );
  return data;
}

export const useCarbonReport = (
  // startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  // endTime = new Date(),
  startTime = new Date('2022-03-30'),
  endTime = new Date('2022-04-02'),
): IHookReturnWithPeriod<ICarbonReport> => {
  const [query, setQuery] = useState<HistoryQuery>({
    dateRange: [startTime, endTime],
  });

  const useQueryResult = useQuery<ICarbonReport | undefined>(
    ['carbon-report', query],
    () =>
      fetchCarbonReport(query.dateRange[0] as Date, query.dateRange[1] as Date),
    {
      staleTime: Infinity,
    },
  );

  return {
    query,
    setQuery,
    ...useQueryResult,
  } as IHookReturnWithPeriod<ICarbonReport>;
};

async function fetchCarbonAudit(): Promise<ICarbonAudit[]> {
  const { data } = await axios.get<ICarbonAudit[]>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/carbon-audit`,
  );
  return data;
}

export const useCarbonAudit = () => {
  return useQuery<ICarbonAudit[] | undefined>(
    ['carbon-audit'],
    () => fetchCarbonAudit(),
    {
      staleTime: Infinity,
    },
  );
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

async function fetch7DaysSolarGeneration(): Promise<IDashboardBlockSummary> {
  const { data } = await axios.get<IDashboardBlockSummary>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/energy-generation`,
  );
  data.title = '7 Day Solar Generation';
  return data;
}

export const use7DaysSolarGeneration = () => {
  const useQueryResult = useQuery<IDashboardBlockSummary>(
    ['7DaysGreenGeneration'],
    () => fetch7DaysSolarGeneration(),
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
