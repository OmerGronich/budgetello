const env = process.env;
export const environment = {
  production: false,
  apiKey: env.API_KEY,
  apiUrl: 'https://finnhub.io/api/v1/',
};
