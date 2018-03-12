const express = require('express');
const app = express();
const cors = require('cors')
const webPush = require('web-push');
const PORT = process.env.PORT || 3000;
const path = require('path');




webPush.setVapidDetails(
  'mailto:drus@qdqmedia.com',
  'BKOWm3Iz0Yg-k84Uk8a1YWaofSNAsYh3LRxVYPg6HVoivm2EH4s1Y73RQUsRN7m6rVeL9H33bxL9HCxs7d2DEvY',
  'iyFVXcBo_cNBxK_g1wnsm_J8O_Lg0wmnwKUK7dF6Kn8'
);

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);

const pushSubscription = {
  endpoint: '< Push Subscription URL >',
  keys: {
    p256dh: 'BKOWm3Iz0Yg-k84Uk8a1YWaofSNAsYh3LRxVYPg6HVoivm2EH4s1Y73RQUsRN7m6rVeL9H33bxL9HCxs7d2DEvY',
    auth: 'iyFVXcBo_cNBxK_g1wnsm_J8O_Lg0wmnwKUK7dF6Kn8'
  }
};

let subscriptions = [];

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendfile(__dirname + "/public/index.html")
});
app.get('/testing', (req, res) => {
  res.sendStatus(200);
})

app.post('/register', (req, res) => {
  console.log(req.body, 'server body');
  const subscription = JSON.parse(req.body);
  if (subscriptions.some((s) => s.name === subscription.name)) {
    res.sendStatus(201);
  } else {
    subscriptions.push(subscription);
    res.sendStatus(201);
  }
});

app.post('/sendNotification', (req, res) => {
  console.log(req.body, 'body');
  const subscription = JSON.parse(req.body);
  webPush
  .sendNotification(Object.assign(pushSubscription, {endpoint: subscription.endpoint}), 'working')
  .then(() => {
    console.log("push notification has been sent");
    res.sendStatus(201);
  })
  .catch((error) => {
    res.sendStatus(500);
    console.log(error);
  });;
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));