require('dotenv').config();

export default {
  appName: process.env.REACT_APP_NAME,
  version: process.env.REACT_APP_VERSION,
  backendUrl: process.env.REACT_APP_BACKEND_URL,
};
