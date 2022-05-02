QUnit.module('API', function () {
  QUnit.module('Low Level', function () {
    QUnit.test('simplyRawApi exists', function (assert) {
      assert.equal(typeof simplyRawApi, 'object', 'simplyRawApi object should exist')
    });
  });
});
