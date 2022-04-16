const env = process.env;

export const environment = {
  production: true,
  apiKey: env.API_KEY,
  fbKey: env.FB_KEY,
  apiUrl: 'https://www.alphavantage.co',
  firebase: {
    projectId: 'budgetello',
    appId: '1:179562931851:web:bf024adb6235e12cac568e',
    storageBucket: 'budgetello.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyAT5A96NQSb_Fzlyk2bEQjnBGkSOoKkftY',
    authDomain: 'budgetello.firebaseapp.com',
    messagingSenderId: '179562931851',
    measurementId: 'G-JEEKE9B14K',
  },
};
