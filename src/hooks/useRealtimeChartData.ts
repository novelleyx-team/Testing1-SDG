import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ChartDataPoint {
  name: string;
  value: number;
}

export function useRealtimeChartData(
  tableName: string,
  nameColumn: string,
  valueColumn: string
) {
  const [data, setData] = useState<ChartDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      const { data: result, error } = await supabase
        .from(tableName)
        .select(`${nameColumn}, ${valueColumn}`)
        .limit(20);

      if (error) {
        console.error(`Error fetching data for chart (${tableName}):`, error);
        if (isMounted) {
          setData([]);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted && result) {
        const transformedData: ChartDataPoint[] = result.map((row) => {
          const r = row as unknown as Record<string, unknown>;
          return {
            name: String(r[nameColumn] || 'Unknown'),
            value: Number(r[valueColumn] || 0),
          };
        });

        setData(transformedData.length > 0 ? transformedData : []);
        setIsLoading(false);
      }
    }

    fetchInitialData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`public:${tableName}:changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          // Re-fetch data when changes occur to ensure consistent sorting/limits
          fetchInitialData();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [tableName, nameColumn, valueColumn]);

  return { data, isLoading };
}
