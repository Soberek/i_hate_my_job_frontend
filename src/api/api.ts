import axios from "axios";

import { ActionI, initialActionFormValuesI } from "../types/Action";
import { ProgramNameI } from "../types/ProgramName";
import { Topic } from "../types/Topic";

const API_URL: string = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
  }
});

// generic fetch function
export const fetchData = async <T>(endpoint: string): Promise<T | null> => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found, authorization failed.");
    return null;
  }

  try {
    const response = await apiClient.get<T>(`${API_URL}${endpoint}`);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Failed to fetch data from ${endpoint}: `, response.status);
      return null;
    }
  } catch (err) {
    console.error(`Error fetching data from ${endpoint}:`, err);
    return null;
  }
};

export const postData = async <T>(endpoint: string, data: T) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found, authorization failed.");
    return null;
  }

  try {
    const response = await apiClient.post(`${API_URL}${endpoint}`, data);

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      console.error(`Failed to post data from ${endpoint}: `, response.status);
      return null;
    }
  } catch (err) {
    console.error(`Error posting data to ${endpoint}:`, err);
    return null;
  }
};

//  TOPICS
export const fetchTopics = async (): Promise<Topic[] | null> => {
  return fetchData<Topic[]>("/api/topics");
};

// PROGRAM NAMES
export const fetchProgramNames = async (): Promise<ProgramNameI[] | null> => {
  return fetchData<ProgramNameI[]>("/api/program_names");
};

// ACTIONS

export const postAction = async (values: initialActionFormValuesI): Promise<ActionI[] | null> => {
  try {
    const response = await postData("/api/actions", values);

    if (response) {
      console.log("Action successfully submitted:", response);
      return response;
    } else {
      console.error("Action submission failed.");
      return null;
    }
  } catch (err) {
    console.error("Error submitting action:", err);
    return null;
  }
};
