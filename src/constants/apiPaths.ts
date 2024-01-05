const API_PATHS = {
  product: import.meta.env.VITE_PRODUCTS_API,
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: import.meta.env.VITE_IMPORT_API,
  bff: import.meta.env.VITE_BFF_API,
  cart: import.meta.env.VITE_CART_API,
};

export default API_PATHS;
