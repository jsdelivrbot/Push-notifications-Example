self.addEventListener('push', function(event) {
  let data = event.data.json();
  console.log(data, 'working');

  event.waitUntil(
    self.registration.showNotification(data.title, {
      lang: data.lang,
      body: data.body,
      icon: data.icon,
      vibrate: [500, 100, 500]
    })
  );
});
