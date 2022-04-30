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

  QUnit.module('getBoardId()', function () {
    QUnit.testStart(function () {
      boardMapping = {}
    })

    QUnit.test('given nothing', function (assert) {
      const actual = getBoardId()
      const expected = 'deck'

      assert.equal(actual, expected, 'getBoardId() should return "deck" when not given any parameters')
    })

    QUnit.test.each('given value without board mapping', {
        "undefined": undefined,
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
        "function": function () {},
      },
      function (assert, value) {
        const actual = getBoardId(value)
        const expected = 'deck'

        assert.equal(actual, expected, 'getBoardId() should return "deck" when given parameter without a board mapping')
      }
    );

    QUnit.test('given value with board mapping', function (assert) {
      const expected = 'bar'

      boardMapping = {
        foo: expected
      }

      const actual = getBoardId('foo')

      assert.equal(actual, expected, 'getBoardId() should return mapped board when given parameter with a board mapping')
    })
  })

  QUnit.module('getItem()', function () {
    QUnit.test('Assert True', function (assert) {
      assert.true(true)
    })
  })

  QUnit.module('setItem()', function () {
    QUnit.test('Assert True', function (assert) {
      assert.true(true)
    })
  })

});
