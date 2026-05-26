export const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET": return action.items;
    case "ADD": {
      const addQty = action.product.qty || 1;
      const ex = state.find((i) => i.id === action.product.id);
      if (ex)
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + addQty } : i
        );
      return [...state, { ...action.product, qty: addQty }];
    }
    case "SET_QTY":
      return state.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i));
    case "INC": return state.map((i) => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case "DEC": return state.map((i) => i.id === action.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i);
    case "REMOVE": return state.filter((i) => i.id !== action.id);
    case "CLEAR": return [];
    default: return state;
  }
};