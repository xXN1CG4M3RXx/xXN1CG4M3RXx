import { useEffect, useState } from "react";
import { fetchCachedData } from "../lib/cache";

export const DATA_TYPES = ["profile", "projects", "skills", "setup", "interests"];

const EMPTY = Object.fromEntries(DATA_TYPES.map((type) => [type, null]));

/**
 * Load every public `settings/<type>` document in one pass.
 * `fetchCachedData` serves the in-memory/localStorage cache instantly and
 * revalidates in the background, so `loading` flips as soon as the first
 * cached snapshot is available.
 */
export function useSiteData() {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    Promise.all(DATA_TYPES.map((type) => fetchCachedData(type)))
      .then((results) => {
        if (!alive) return;
        setData(Object.fromEntries(DATA_TYPES.map((type, i) => [type, results[i]])));
      })
      .catch((err) => {
        if (alive) setError(err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}

/** Convenience accessors so pages read nicely. */
export const asList = (doc) => (doc && Array.isArray(doc.list) ? doc.list : []);
