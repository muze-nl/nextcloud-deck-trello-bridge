QUnit.module('Functions', function () {
  QUnit.test('Functions should exist', function (assert) {
    assert.equal(typeof clone, 'function', 'function clone should exist')
    assert.equal(typeof getBoardId, 'function', 'function getBoardId should exist')
    assert.equal(typeof self.setItem, 'function', 'function self.setItem should exist')
    assert.equal(typeof self.getItem, 'function', 'function self.getItem should exist')
  });
});
