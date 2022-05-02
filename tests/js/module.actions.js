QUnit.module('Actions', function () {
  QUnit.test('simplyActions exists', function (assert) {
    assert.equal(typeof simplyActions, 'object', 'simplyActions object should exist')
  });

  QUnit.module('getTrelloBoard()', function () {
    QUnit.todo(`Promise rejected by  getBoard / getBoardLists / getBoardCards / getBoardActions`, function (assert) {
    })

    QUnit.test('without trelloBoardId', function (assert) {
      assert.rejects(
        simplyActions.getTrelloBoard(),
        /get.+ failed/,
        'getTrelloBoard() should reject promise when not given a trello board id'
      );
    })

    QUnit.test('with trelloBoardId', function (assert) {
      const mockId = 'mockId';
      const mockBoard = 'mockBoard';

      Object.entries({
        getBoard: mockBoard,
        getBoardActions: [{data: {card: {}}}],
        getBoardCards: [],
        getBoardLists: [],
      }).forEach(([method, value]) => {
        sinon.mock(simplyDataApi).expects(method).withArgs(mockId).returns(Promise.resolve(value));
      });

      return simplyActions.getTrelloBoard(mockId).then(function (actual) {
        const expected = {"board": mockBoard, "lists": []}
        assert.deepEqual(actual, expected, 'getTrelloBoard() should return object with board and lists')
      })
    });

    QUnit.todo('BoardActions in Stub, with action.data.card.id', function (assert) {
    })

    QUnit.todo('BoardActions in Stub, type: commentCard', function (assert) {
    })

    QUnit.todo('BoardActions in Stub, type: createCard', function (assert) {
    })

    QUnit.todo('BoardActions in Stub, type: updateCard', function (assert) {
    })

    QUnit.todo('BoardCards in Stub', function (assert) {
    })

    QUnit.todo('BoardLists in Stub', function (assert) {
    })
  });

  QUnit.module('loadConfig()', function () {
    const URL_CONFIG = '/index.php/apps/deck/trello-config.js';

    const mockBoardMapping = 'mockBoardMapping';
    const mockKey = 'mockKey';
    const mockToken = 'mockToken';

    const mockResponse = {
      json: function () {
        return Promise.resolve({
          boardMapping: mockBoardMapping,
          key: mockKey,
          token: mockToken,
        });
      }
    };

    QUnit.test('retrieves Trello configuration', function (assert) {
      fetch = sinon.mock().withExactArgs(URL_CONFIG).resolves(mockResponse)

      return simplyActions.loadConfig().then(function (a) {
        assert.ok(fetch.verify(), 'fetch should be called with trello-config.js')
        // fetch.restore()
      })
    });

    QUnit.test('', function (assert) {
      fetch = sinon.mock().resolves(mockResponse)

      return simplyActions.loadConfig().then(function () {
        // fetch.restore()
        assert.deepEqual(simplyRawApi.token, mockToken, 'loadConfig() should set key on simplyRawApi')
        assert.deepEqual(simplyRawApi.key, mockKey, 'loadConfig() should set token on simplyRawApi')
        assert.deepEqual(boardMapping, mockBoardMapping, 'loadConfig() should set boardMapping')
      })
    })
  });
});
