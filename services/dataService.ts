
import { AppData } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

const SIMULATED_LATENCY = 400; // ms

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Fetches the initial seed data from the public folder
const fetchSeedData = async (): Promise<AppData> => {
  const response = await fetch('/data/seed.json');
  if (!response.ok) {
    throw new Error('Failed to fetch seed data');
  }
  return response.json();
};

// Initializes data in localStorage if it doesn't exist
export const initData = async (): Promise<void> => {
  await delay(SIMULATED_LATENCY);
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    console.log("No data found in localStorage. Seeding initial data.");
    const seedData = await fetchSeedData();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedData));
  }
};

// Gets all data from localStorage
export const getData = async (): Promise<AppData | null> => {
  await delay(SIMULATED_LATENCY);
  const dataString = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (dataString) {
    try {
      return JSON.parse(dataString) as AppData;
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      return null;
    }
  }
  return null;
};

// Saves all data to localStorage
export const setData = async (data: AppData): Promise<void> => {
  await delay(SIMULATED_LATENCY);
  try {
    const dataString = JSON.stringify(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, dataString);
  } catch (error) {
    console.error("Failed to save data to localStorage", error);
  }
};

// Resets data to the initial seed data
export const resetData = async (): Promise<AppData> => {
  await delay(SIMULATED_LATENCY);
  console.log("Resetting data to seed.");
  const seedData = await fetchSeedData();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedData));
  return seedData;
};
