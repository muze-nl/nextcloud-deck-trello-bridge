QUnit.module('Event Listeners', function () {
  QUnit.test('Event Listeners exists', function (assert) {

    assert.equal(typeof EventListeners, 'object', 'EventListener catcher should exist')

    assert.equal(typeof EventListeners.activate, 'function', 'activate event listener should exist')
    assert.equal(typeof EventListeners.install, 'function', 'install event listener should exist')
    assert.equal(typeof EventListeners.fetch, 'function', 'fetch event listener should exist')
  });
});
