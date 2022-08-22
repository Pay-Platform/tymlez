import { useState, useEffect } from 'react';

export interface IWeatherData {
  main: any;
  weather: [any];
  name: string;
}

export const useWeather = (
  city?: string,
  country?: string,
  lat?: number,
  lon?: number,
): {
  data: IWeatherData | null;
  loading: boolean;
} => {
  const [data, setData] = useState<IWeatherData | null>(null);
  // const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const API_KEY = '908ad75f36452c11ff4306cd53162218';
      let url = 'https://api.openweathermap.org/data/2.5/weather';
      if (city && country) {
        url += `?q=${city},${country}&units=metric&appid=${API_KEY}`;
      } else if (lat !== undefined && lon !== undefined) {
        url += `?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      } else {
        return;
      }
      const response = await fetch(url);
      const fetchedData = await response.json();
      setData(fetchedData);
      // setList(fetchedData);
      setLoading(false);
    }
    fetchData();
  }, [city, country, lat, lon]);
  return {
    data,
    loading,
  };
};
