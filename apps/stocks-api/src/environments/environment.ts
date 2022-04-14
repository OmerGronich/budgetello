const env = process.env;

export const environment = {
  production: false,
  apiKey: env.API_KEY,
  apiUrl: 'https://www.alphavantage.co',
};
