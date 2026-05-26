import { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";

export const useProducts = (tagId = 0) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch(`/api/products/${tagId}`)
      .then((data) => {
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tagId]);

  return { products, loading, error };
};
