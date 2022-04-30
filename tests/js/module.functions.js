QUnit.module('Functions', function () {
  const originals = {}

  QUnit.moduleStart(function () {
    originals['console.log'] = console.log;

    console.wasCalled = false;

    console.log = function (message) {
      console.wasCalled = true;
      console.message = message;
    };
  })

  QUnit.testStart(function () {
    self.storedData = {};
    console.wasCalled = false;
  })

  QUnit.moduleDone(function (details) {
    console.log = originals['console.log'];
  })

  QUnit.test('Functions should exist', function (assert) {
    assert.equal(typeof clone, 'function', 'function clone should exist')
    assert.equal(typeof getBoardId, 'function', 'function getBoardId should exist')
    assert.equal(typeof self.getItem, 'function', 'function self.getItem should exist')
    assert.equal(typeof self.setItem, 'function', 'function self.setItem should exist')
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
    QUnit.testStart(function () {
      self.storedData = {};
    })

    QUnit.test('given nothing', function (assert) {
      const actual = self.getItem()
      const expected = undefined

      assert.equal(actual, expected, 'getItem() should return undefined when not given any parameters')
      assert.true(console.wasCalled, 'getItem() should call console.log() when not given any parameters')
      assert.equal(console.message, 'getting undefined:undefined', 'getItem() should call console.log() when not given any parameters')
    })

    QUnit.test('given key for unstored item', function (assert) {
      const actual = self.getItem('foo')

      assert.equal(actual, undefined, 'getItem() should return undefined when given a key for an item that has not been stored')
      assert.true(console.wasCalled, 'getItem() should call console.log() when given a key')
      assert.equal(console.message, 'getting foo:undefined', 'getItem() should call console.log() when given a key')
    })

    QUnit.test('given key for stored item', function (assert) {
      self.storedData = {
        foo: 'bar'
      }

      const actual = self.getItem('foo')

      assert.equal(actual, 'bar', 'getItem() should return the stored item when given a key for an item that has been stored')
      assert.true(console.wasCalled, 'getItem() should call console.log() when given a key')
      assert.equal(console.message, 'getting foo:bar', 'getItem() should call console.log() when given a key')
    })
  })

  QUnit.module('setItem()', function () {
    QUnit.testStart(function () {
      self.storedData = {};
      console.wasCalled = false;
    })

    QUnit.test('given nothing', function (assert) {
      self.setItem()

      assert.deepEqual(self.storedData, {"undefined": undefined}, 'setItem() should set undefined key and value when not given any parameters')
      assert.true(console.wasCalled, 'setItem() should call console.log() when not given any parameters')
      assert.equal(console.message, 'storing undefined:undefined', 'setItem() should call console.log() when not given any parameters')
    })

    QUnit.test('given key', function (assert) {
      self.setItem('foo')

      assert.deepEqual(self.storedData, {"foo": undefined}, 'setItem() should set undefined value for given key when only given a key')
      assert.true(console.wasCalled, 'setItem() should call console.log() when given a key')
      assert.equal(console.message, 'storing foo:undefined', 'setItem() should call console.log() when given a key')
    })

    QUnit.test('given key and value', function (assert) {
      self.setItem('foo', 'bar')

      assert.deepEqual(self.storedData, {foo: "bar"}, 'setItem() should set value for given key when given a key and value')
      assert.true(console.wasCalled, 'setItem() should call console.log() when given a key and value')
      assert.equal(console.message, 'storing foo:bar', 'setItem() should call console.log() when given a key')
    })
  })
});
