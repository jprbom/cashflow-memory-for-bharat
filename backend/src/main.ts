import { createApp } from './app.js';

const port = Number(process.env.PORT || 4103);
const app = createApp();

app.listen(port, () => {
  console.log('Cashflow Memory for Bharat API listening on http://127.0.0.1:' + port);
});

