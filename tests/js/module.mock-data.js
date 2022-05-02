QUnit.module('Mock Data', function () {
  QUnit.test('Mock Data exists', function (assert) {
    assert.equal(typeof mockBoard, 'object', 'mockBoard object should exist')
    assert.equal(typeof mockCard1, 'object', 'mockCard1 object should exist')
    assert.equal(typeof mockCard2, 'object', 'mockCard2 object should exist')
    assert.equal(typeof mockComment1, 'object', 'mockComment1 object should exist')
    assert.equal(typeof mockComments, 'object', 'mockComments object should exist')
    assert.equal(typeof mockStack1, 'object', 'mockStack1 object should exist')
    assert.equal(typeof mockStack2, 'object', 'mockStack2 object should exist')
    assert.equal(typeof mockStacks, 'object', 'mockStacks array should exist')
  });
});
