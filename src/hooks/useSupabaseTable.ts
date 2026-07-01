import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Options {
  orderBy?: string;
  ascending?: boolean;
  filterColumn?: string;
  filterValue?: string | number | boolean;
}

/**
 * Fetches all rows from a Supabase table. If Supabase isn't configured yet
 * (no .env values), it returns the provided demo/fallback data instead, so
 * the app always renders something meaningful.
 */
export function useSupabaseTable<T>(
  table: string,
  fallback: T[],
  options: Options = {},
) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setData(fallback);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    let query = supabase.from(table).select('*');
    if (options.filterColumn && options.filterValue !== undefined) {
      query = query.eq(options.filterColumn, options.filterValue);
    }
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }

    query.then(({ data: rows, error: err }) => {
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setData(fallback);
      } else if (rows && rows.length > 0) {
        setData(rows as T[]);
      } else {
        setData(fallback);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return { data, loading, error };
}
