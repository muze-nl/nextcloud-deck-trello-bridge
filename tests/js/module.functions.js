QUnit.module('Functions', function () {
  QUnit.test('Functions should exist', function (assert) {
    assert.equal(typeof clone, 'function', 'function clone should exist')
    assert.equal(typeof getBoardId, 'function', 'function getBoardId should exist')
    assert.equal(typeof self.setItem, 'function', 'function self.setItem should exist')
    assert.equal(typeof self.getItem, 'function', 'function self.getItem should exist')
  });

  QUnit.module('clone()', function () {
    QUnit.test('given nothing', function (assert) {
      assert.throws(
        function () {
          clone()
        },
        new SyntaxError('JSON.parse: unexpected character at line 1 column 1 of the JSON data'),
        'clone() should throw an error when not given any parameters'
      );
    })

    QUnit.test('given undefined', function (assert) {
      assert.throws(
        function () {
          clone(undefined)
        },
        new SyntaxError('JSON.parse: unexpected character at line 1 column 1 of the JSON data'),
        'clone() should throw an error when given undefined'
      );
    })

    QUnit.test('given function', function (assert) {
      assert.throws(
        function () {
          clone(function () {})
        },
        new SyntaxError('JSON.parse: unexpected character at line 1 column 1 of the JSON data'),
        'clone() should throw an error when given undefined'
      );
    })

    QUnit.test.each('given input matches return value', {
        "true": true,
        "false": false,
        "null": null,
        "int:0": 0,
        "int:1": 1,
        "string:empty": '',
        "string:foo": 'foo',
        "array:empty": [],
        "array": ['foo', 'bar'],
        "object:empty": {},
        "object:simple": {foo: 'bar'},
        "object:complex": mockBoard,
      },
      function (assert, value) {
        assert.deepEqual(clone(value), value, 'clone() should return same value as given when given a parameter')
      }
    );

    QUnit.test('return value is a clone', function (assert) {
      const original = {foo: 'bar'}

      const actual = clone(original);

      original.foo = 'baz';

      assert.deepEqual(actual, {foo: 'bar'}, 'clone() should return a clone of the given object when called with an object')
    });
  })
});
