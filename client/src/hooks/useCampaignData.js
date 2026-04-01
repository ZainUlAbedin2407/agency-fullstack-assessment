import { useState, useEffect } from "react";

export function useCampaignData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to the server
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error("Failed to fetch campaign data");
        }
        const result = await response.json();
        setData(result.campaigns || result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
