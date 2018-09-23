const express = require('express');
const app = express();
const cors = require('cors')
const webPush = require('web-push');
const PORT = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');


var vapidDetails = {
  subject: 'mailto:bidstopper@gmail.com',
  publicKey: 'BKOWm3Iz0Yg-k84Uk8a1YWaofSNAsYh3LRxVYPg6HVoivm2EH4s1Y73RQUsRN7m6rVeL9H33bxL9HCxs7d2DEvY',
  privateKey: 'iyFVXcBo_cNBxK_g1wnsm_J8O_Lg0wmnwKUK7dF6Kn8'
}

webPush.setVapidDetails(
  vapidDetails.subject,
  vapidDetails.publicKey,
  vapidDetails.privateKey
);

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);

let subscriptions = [];

app.use(bodyParser.json())
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendfile(__dirname + "/public/index.html")
});
app.get('/subscriptions', (req, res) => {
  res.send(JSON.stringify(subscriptions));
})

app.post('/register', (req, res) => {
  const subscription = req.body;
  if (subscriptions.some((s) => s.name === subscription.name)) {
    res.sendStatus(304);
  } else {
    subscriptions.push(subscription);
    res.sendStatus(201);
  }
});

app.post('/sendNotification', (req, res) => {
  const subscription = req.body;

  const payload = {
    title: 'RusEu Notifications',
    options: {
      lang: 'en',
      body: 'Is this a good application?',
      icon: 'https://lh3.ggpht.com/uA_9YvBqat-4ftl9Kn40fGuf_6GmDUKuba_Vjn2fo9CnojlOGandrcj2pLp67Q5Wb6I=w300',
      vibrate: [500, 100, 500],
      actions: [
        {
          action: 'accept',
          title: 'Yes, awesome',
          icon: 'https://dryicons.com/uploads/icon/preview/2810/icon_grid_1x_accept.png'
        },
        {
          action: 'dismiss',
          title: 'No, very simple',
          icon: 'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/close-circle-red-256.pn'
        }
      ]
    }
  };
  webPush
  .sendNotification(subscription, JSON.stringify(payload))
  .then(() => {
    res.sendStatus(201);
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });;
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
