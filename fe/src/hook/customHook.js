import { useEffect } from "react";

export default function useFetchData(fectchFunction) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fectchFunction();
        if (isMounted) setData(data);
      } catch (err) {
        if (isMounted) {
          setError(err.reponse.data.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
      fetchData();
      return () => {
        isMounted = false;
      };
    };
  }, [fectchFunction]);

  return { data, setData, loading, error };
} 