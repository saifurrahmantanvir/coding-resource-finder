const PORT = process.env.PORT || 2856;
const API_BASE_URL =
  process.env.REACT_APP_API_PROD_BASE_URL || `http://localhost:${PORT}`;
const CLIENT_BASE_URL =
  process.env.REACT_APP_CLIENT_PROD_BASE_URL || `http://localhost:3000`;

export { PORT, API_BASE_URL, CLIENT_BASE_URL };
