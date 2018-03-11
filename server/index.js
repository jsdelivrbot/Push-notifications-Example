const express = require('express');
const app = express();
const cors = require('cors')
const webPush = require('web-push');
const PORT = process.env.PORT || 3000


app.use(cors());

webPush.setVapidDetails(
  'mailto:drus@qdqmedia.com',
  'BKOWm3Iz0Yg-k84Uk8a1YWaofSNAsYh3LRxVYPg6HVoivm2EH4s1Y73RQUsRN7m6rVeL9H33bxL9HCxs7d2DEvY',
  'iyFVXcBo_cNBxK_g1wnsm_J8O_Lg0wmnwKUK7dF6Kn8'
);

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});

app.post('/sendNotification', (req, res) => {
  setTimeout(() => {
    console.log(req.query.endpoint, req.query.ttl);
    webPush
    .sendNotification({
      endpoint: req.query.endpoint,
      TTL: req.query.ttl
    })
    .then(() => {
      console.log("push notification has been sent");
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.log(error);
    });
  }, req.query.delay * 1000);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))