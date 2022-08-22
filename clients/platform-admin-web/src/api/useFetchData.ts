import axios from 'axios';
import type {
  IChannel,
  ICircuit,
  IQueryChannel,
  IQueryCircuit,
  IQueryInstaller,
  IQueryMeter,
  IQuerySite,
  ISite,
} from '@tymlez/platform-api-interfaces';
import React from 'react';
import { useQuery } from 'react-query';

// const clientName = 'cohort';

async function fetchInstallerData(
  page: number,
  pageSize: number,
): Promise<IQueryInstaller> {
  const params = { page, pageSize };
  const { data } = await axios.get<IQueryInstaller>(
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/installer`,
    { params },
  );
  return data;
}

export function useInstallerData(refreshTime: Date) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [updateTime, setUpdateTime] = React.useState(new Date());

  const { data: queryResult = { total: 0, installers: [] }, isLoading } =
    useQuery<IQueryInstaller>(
      ['installers', page, pageSize],
      () => fetchInstallerData(page, pageSize),
      {
        staleTime: 10000,
      },
    );

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  return {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    updateTime,
    setUpdateTime,
    refreshTime,
  };
}

export async function fetchChannelDetail(siteName: string) {
  const { data } = await axios.get<IChannel>(
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/sites/details/${siteName}`,
  );
  return data;
}

export async function fetchSiteDetail(siteName: string) {
  const { data } = await axios.get<ISite>(
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/sites/details/${siteName}`,
  );
  return data;
}

export async function fetchSiteData(
  page = 0,
  pageSize = 25,
): Promise<IQuerySite> {
  const params = { page, pageSize };
  const { data } = await axios.get<IQuerySite>(
    // `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/sites/${clientName}`,
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/sites`,
    { params },
  );
  return data;
}

export function useSiteData(refreshTime: Date) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [updateTime, setUpdateTime] = React.useState(new Date());

  const { data: queryResult = { total: 0, sites: [] }, isLoading } =
    useQuery<IQuerySite>(
      ['sites', page, pageSize],
      () => fetchSiteData(page, pageSize),
      {
        staleTime: 10000,
      },
    );

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  return {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    updateTime,
    setUpdateTime,
    refreshTime,
  };
}

export async function fetchMeterData(
  page = 0,
  pageSize = 25,
): Promise<IQueryMeter> {
  const params = { page, pageSize };
  const { data } = await axios.get<IQueryMeter>(
    // `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/meter-info/${clientName}`,
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/meter-info`,
    { params },
  );
  return data;
}

export function useMeterData(refreshTime: Date) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [updateTime, setUpdateTime] = React.useState(new Date());

  const { data: queryResult = { total: 0, meters: [] }, isLoading } =
    useQuery<IQueryMeter>(
      ['meter-info', page, pageSize],
      () => fetchMeterData(page, pageSize),
      {
        staleTime: 10000,
      },
    );

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  return {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    updateTime,
    setUpdateTime,
    refreshTime,
  };
}

export async function fetchCircuitDetail(circuitName: string) {
  const { data } = await axios.get<ICircuit>(
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/circuits/details/${circuitName}`,
  );
  return data;
}

export async function fetchCircuitData(
  page = 0,
  pageSize = 25,
): Promise<IQueryCircuit> {
  const params = { page, pageSize };
  const { data } = await axios.get<IQueryCircuit>(
    // `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/circuits/${clientName}`,
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/circuits`,
    { params },
  );
  return data;
}

export function useCircuitData(refreshTime: Date) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [updateTime, setUpdateTime] = React.useState(new Date());

  const { data: queryResult = { total: 0, circuits: [] }, isLoading } =
    useQuery<IQueryCircuit>(
      ['circuits', page, pageSize],
      () => fetchCircuitData(page, pageSize),
      {
        staleTime: 10000,
      },
    );

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  return {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    updateTime,
    setUpdateTime,
    refreshTime,
  };
}

async function fetchChannelData(
  page: number,
  pageSize: number,
): Promise<IQueryChannel> {
  const params = { page, pageSize };
  const { data } = await axios.get<IQueryChannel>(
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/channels`,
    { params },
  );
  return data;
}

export function useChannelData(refreshTime: Date) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [updateTime, setUpdateTime] = React.useState(new Date());

  const { data: queryResult = { total: 0, channels: [] }, isLoading } =
    useQuery<IQueryChannel>(
      ['channels', page, pageSize],
      () => fetchChannelData(page, pageSize),
      {
        staleTime: 10000,
      },
    );

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  return {
    queryResult,
    isLoading,
    page,
    pageSize,
    handleChangePage,
    handleChangeRowsPerPage,
    updateTime,
    setUpdateTime,
    refreshTime,
  };
}
