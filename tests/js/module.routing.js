QUnit.module('Routes', function () {
  QUnit.test('Routing exists', function (assert) {
    assert.equal(typeof routes, 'object', 'routes object should exist')
    assert.equal(typeof simplyRoute, 'object', 'simplyRoute object should exist')
  });
});
