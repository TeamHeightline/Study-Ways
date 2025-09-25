const dev_env = false;
export const FILE_URL = "https://storage.googleapis.com/study-ways-files";

export const SERVER_BASE_URL = dev_env
  ? "http://127.0.0.1:8000"
  : "https://iotbv3-qrhz6rl3cq-lz.a.run.app";

const rest_dev_env = false;
export const REST_SERVER_URL = rest_dev_env
  ? "http://127.0.0.1:3001"
  : "https://sw-backend-2-qrhz6rl3cq-lz.a.run.app";
