import { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";

export const useOrders = (userId, { enabled = true } = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled || userId === undefined || userId === null) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch(`/api/orders/${userId}`)
      .then((data) => {
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
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
  }, [userId, enabled]);

  return { orders, setOrders, loading, error };
};
