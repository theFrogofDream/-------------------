import { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/products")
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return {
    products,
    loading,
    error,
  };
};