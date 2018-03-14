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
    clients.openWindow("/accept");
  }
  else {
    clients.openWindow("/dismiss");
  }
}, false);