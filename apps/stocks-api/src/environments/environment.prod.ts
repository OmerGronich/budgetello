const env = process.env;

export const environment = {
  production: true,
  apiKey: env.API_KEY,
  apiUrl: 'https://www.alphavantage.co',
};