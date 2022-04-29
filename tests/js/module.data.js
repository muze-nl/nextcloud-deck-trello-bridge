QUnit.module('Data', function () {
  QUnit.test('storedData exists', function (assert) {
    assert.equal(typeof self.storedData, 'object', 'storedData object should exist')
  });

  QUnit.test('boardMapping exists', function (assert) {
    assert.equal(typeof boardMapping, 'object', 'boardMapping object should exist')
  });
  QUnit.test('ID placeholders exist', function (assert) {
    assert.equal(typeof self.stackId, 'number', 'stackId placeholder exist')
    assert.equal(typeof self.cardId, 'number', 'cardId placeholder exist')
    assert.equal(typeof self.commentId, 'number', 'commentId placeholder exist')
  });
});
