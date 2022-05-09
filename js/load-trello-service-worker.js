if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/trello-service-worker.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  })
  .catch(function(error) {
    console.log('Service worker registration failed, error:', error);
  });
  if (navigator.serviceWorker.controller === null) {
    window.location.reload();
  }
}
