const API_PATHS = {
  product: import.meta.env.VITE_PRODUCTS_API,
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: import.meta.env.VITE_IMPORT_API,
  bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  cart: "https://1.execute-api.eu-west-1.amazonaws.com/dev",
};

export default API_PATHS;
