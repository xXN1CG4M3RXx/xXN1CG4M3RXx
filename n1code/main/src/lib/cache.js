import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const dataCache = {
  profile: null,
  projects: null,
  skills: null,
  setup: null,
  interests: null,
};

const fetchFromFirebase = async (type) => {
  try {
    const docRef = doc(db, "settings", type);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      dataCache[type] = data;
      localStorage.setItem(`n1code_cache_${type}`, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
  return null;
};

export const fetchCachedData = async (type, onUpdate) => {
  const fetchFresh = async () => {
    const freshData = await fetchFromFirebase(type);
    if (freshData && onUpdate) {
      onUpdate(freshData);
    }
  };

  // 1. Return in-memory cache instantly if available (for fast navigation)
  if (dataCache[type]) {
    fetchFresh(); // Always revalidate in background
    return dataCache[type];
  }

  // 2. Return from localStorage instantly if available (for fast reopen/refresh)
  const local = localStorage.getItem(`n1code_cache_${type}`);
  if (local) {
    try {
      dataCache[type] = JSON.parse(local);
      // Background revalidate to ensure fresh data for next time
      fetchFresh();
      return dataCache[type];
    } catch (e) {
      console.warn("Failed to parse local cache");
    }
  }

  // 3. Fallback to network fetch if absolutely no cache exists
  const fresh = await fetchFromFirebase(type);
  if (fresh && onUpdate) {
    onUpdate(fresh);
  }
  return fresh;
};
