QUnit.module('API', function () {
  QUnit.module('High Level', function () {
    QUnit.test('simplyDataApi exists', function (assert) {
      assert.equal(typeof simplyDataApi, 'object', 'simplyDataApi object should exist')
    });
  });
});
