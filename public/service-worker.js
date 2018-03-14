self.addEventListener('install', function(event) {

  if (self.skipWaiting) self.skipWaiting();

});

self.addEventListener('push', (event) => {
  let data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});

self.addEventListener('notificationclick', (event) => {
  var messageId = event.notification.data;

  event.notification.close();

  if (event.action === 'accept') {

    self.clients.matchAll().then((clients) => Promise.all(clients.map((client) => {
      console.log('client event accept', client, event);
      return client.postMessage({
        msg: 'accepted'
      });
    })));

    // clients.openWindow("/accept");
  }
  else {

    self.clients.matchAll().then((clients) => Promise.all(clients.map((client) => {
      console.log('client event decline', client, event);
      return client.postMessage({
        msg: "Declined"
      });
    })));
    // clients.openWindow("/dismiss");
  }
}, false);

self.addEventListener('message', function(event){
  console.log("SW Received Message: " + event.data);
});