self.addEventListener('install', function(e) {
  console.log("service worker reporting for duty");
  return self.skipWaiting();
});
self.addEventListener('activate', function(event) {
  console.log("service worker activated");
  return self.clients.claim();
});

self.storedData = {};
self.setItem = function(key, value) {
  console.log("storing " + key + ":" + value);
  self.storedData[key] = value;
};
self.getItem = function(key) {
  console.log("getting " + key + ":" + self.storedData[key]);
  return self.storedData[key];
};

var mockBoard = {
  "title" : "Service worker - Trello bridge",
  "owner" : {
    "primaryKey":"yvo",
    "uid":"yvo",
    "displayname":"Yvo Brevoort",
    "type":0
  },
  "color":"312438",
  "archived":false,
  "labels":[
    {"title":"Finished","color":"31CC7C","boardId":3,"cardId":null,"lastModified":1650963821,"id":9,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},
    {"title":"To review","color":"317CCC","boardId":3,"cardId":null,"lastModified":1650963821,"id":10,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},
    {"title":"Action needed","color":"FF7A66","boardId":3,"cardId":null,"lastModified":1650963821,"id":11,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},
    {"title":"Later","color":"F1DB50","boardId":3,"cardId":null,"lastModified":1650963821,"id":12,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"}
  ],
  "acl":[
    {"participant":{"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":1},
    {"participant":{"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":2}
  ],
  "permissions":{"PERMISSION_READ":true,"PERMISSION_EDIT":true,"PERMISSION_MANAGE":true,"PERMISSION_SHARE":true},
  "users":[
    {"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},
    {"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},
    {"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0}
  ],
  "stacks":[],
  "deletedAt":0,
  "lastModified":1650992553,
  "settings":{
    "notify-due":"assigned",
    "calendar":true
  },
  "id":3,
  "ETag":"b0479c0cc73c9dd6b3312b20e8b739fc"
};

var mockCard1 = {
  "title":"sw-card1",
  "description":"service worker card description",
  "stackId":"7",
  "type":"plain",
  "lastModified":1650992544,
  "lastEditor":"yvo",
  "createdAt":1650992518,
  "labels":[],
  "assignedUsers":[],
  "attachments":null,
  "attachmentCount":0,
  "owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},
  "order":999,
  "archived":false,
  "duedate":null,
  "deletedAt":0,
  "commentsUnread":0,
  "id":"7",
  "ETag":"55bb13a86644ccb2e57dd2193a4c0aea",
  "overdue":0
};
var mockCard2 = {
  "title":"sw-card2",
  "description":"",
  "stackId":8,
  "type":"plain",
  "lastModified":1650992553,
  "lastEditor":null,
  "createdAt":1650992553,
  "labels":[],
  "assignedUsers":[],
  "attachments":null,
  "attachmentCount":0,
  "owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},
  "order":999,
  "archived":false,
  "duedate":null,
  "deletedAt":0,
  "commentsUnread":0,
  "id":8,
  "ETag":"b0479c0cc73c9dd6b3312b20e8b739fc",
  "overdue":0
};

var mockStack1 = {
  "title":"sw-list1",
  "boardId":3,
  "deletedAt":0,
  "lastModified":1650992544,
  "cards":[mockCard1],
  "order":999,
  "id":"7",
  "ETag":"55bb13a86644ccb2e57dd2193a4c0aea"
};

var mockStack2 = {
  "title":"sw-list2",
  "boardId":3,
  "deletedAt":0,
  "lastModified":1650992553,
  "cards":[mockCard2],
  "order":999,
  "id":8,
  "ETag":"b0479c0cc73c9dd6b3312b20e8b739fc"
};

var mockComment1 = {
  "id":26,
  "objectId":1,
  "message":"service worker says hello",
  "actorId":"yvo",
  "actorType":"users",
  "actorDisplayName":"Yvo Brevoort",
  "creationDateTime":"2022-04-27T19:03:37+00:00",
  "mentions":[]
};

var mockComments = {
  "ocs":{
    "meta":{"status":"ok","statuscode":200,"message":"OK"},
    "data":[mockComment1]
  }
};

var mockStacks = [mockStack1, mockStack2];

function clone(ob) {
  return JSON.parse(JSON.stringify(ob));
}

var boardMapping = {
  "4" : "5829992a1f0b3e59e6c64759",
  "3" : "mock"
};

var stackId = 1000000;
var cardId = 1000000;
var commentId = 1000000;

function getBoardId(deckBoardId) {
  if (typeof boardMapping[deckBoardId] === "undefined") {
    boardId = "deck";
  } else {
    boardId = boardMapping[deckBoardId];
  }
  return boardId;
}

/* Simply Route */
var simplyRoute = {
  routeInfo : [],
  load : function(routes) {
    var paths = Object.keys(routes);
    var matchParams = /:(\w+|\*)/g;
    var matches, params, path;
    for (var i=0; i<paths.length; i++) {
      path  = paths[i];
      matches = [];
      params  = [];
      do {
        matches = matchParams.exec(path);
        if (matches) {
          params.push(matches[1]);
        }
      } while(matches);
      this.routeInfo.push({
        match:  new RegExp(path.replace(/:\w+/g, '([^/]+)').replace(/:\*/, '(.*)')),
        params: params,
        action: routes[path]
      });
    }
  },
  match: function(request, options) {
    var path = request.url;
    var method = request.method;
    var matches;
    for ( var i=0; i<this.routeInfo.length; i++) {
      if (path[path.length-1]!='/') {
        matches = this.routeInfo[i].match.exec(path+'/');
        if (matches) {
          path+='/';
          // history.replaceState({}, '', path);
        }
      }
      matches = this.routeInfo[i].match.exec(path);
      if (matches && matches.length) {
        var params = {};
        this.routeInfo[i].params.forEach(function(key, i) {
          if (key=='*') {
            key = 'remainder';
          }
          params[key] = matches[i+1];
        });
        Object.assign(params, options);
        if (this.routeInfo[i].action[method]) {
          return this.routeInfo[i].action[method].call(this, params);
        }
      }
    }
  }
};

var simplyActions = {
  getTrelloBoard : function(trelloBoardId) {
    return Promise.all(
      [
        simplyDataApi.getBoard(trelloBoardId),
        simplyDataApi.getBoardLists(trelloBoardId),
        simplyDataApi.getBoardCards(trelloBoardId),
        simplyDataApi.getBoardActions(trelloBoardId)
      ]
    ).then(function(result) {
      var sortedCards = {};
      var cardActions = {};
      
      result[3].forEach(function(action) {
        if (typeof cardActions[action.data.card.id] === "undefined") {
          cardActions[action.data.card.id] = {
            comments : []
          };
        }
        switch (action.type) {
          case "createCard":
            let createDate = parseInt(new Date(action.date).getTime() /1000);
            cardActions[action.data.card.id].ctime = parseInt(new Date(action.date).getTime() /1000);
          break;
          case "updateCard":
            let updateDate = parseInt(new Date(action.date).getTime() /1000);
            if (
              (typeof cardActions[action.data.card.id].mtime === "undefined") ||
              (cardActions[action.data.card.id].mtime < updateDate)
            ) {
              cardActions[action.data.card.id].mtime = updateDate;
            }
          break;
          case "commentCard":
            cardActions[action.data.card.id].comments.push(action);
          break;
        }
      });
      
      result[2].forEach(function(card) {
        if (cardActions[card.id]) {
          card.actions = cardActions[card.id];
        }
        if (typeof sortedCards[card.idList] === "undefined") {
          sortedCards[card.idList] = [];
        }
        sortedCards[card.idList].push(card);
      });
      result[1].forEach(function(list, index) {
        if (sortedCards[list.id]) {
          result[1][index].cards = sortedCards[list.id];
        } else {
          result[1][index].cards = [];
        }
      });
      return {
        board : result[0],
        lists : result[1]
      }
    });
  }
};
  
var routes = {
  "/apps/deck/boards/:deckBoardId" : {
    "GET" : function(params) {
      var trelloBoardId = getBoardId(params.deckBoardId);
      switch (trelloBoardId) {
        case "deck":
          return;
        break;
        case "mock":
          return new Promise(function(resolve, reject) {
            console.log("Boards request intercepted!");
            // var data = JSON.parse('{"title":"Service worker - Trello bridge","owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},"color":"312438","archived":false,"labels":[{"title":"Finished","color":"31CC7C","boardId":3,"cardId":null,"lastModified":1650963821,"id":9,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"To review","color":"317CCC","boardId":3,"cardId":null,"lastModified":1650963821,"id":10,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"Action needed","color":"FF7A66","boardId":3,"cardId":null,"lastModified":1650963821,"id":11,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"Later","color":"F1DB50","boardId":3,"cardId":null,"lastModified":1650963821,"id":12,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"}],"acl":[{"participant":{"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":1},{"participant":{"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":2}],"permissions":{"PERMISSION_READ":true,"PERMISSION_EDIT":true,"PERMISSION_MANAGE":true,"PERMISSION_SHARE":true},"users":[{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},{"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},{"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0}],"stacks":[],"deletedAt":0,"lastModified":1650992553,"settings":{"notify-due":"assigned","calendar":true},"id":3,"ETag":"b0479c0cc73c9dd6b3312b20e8b739fc"}');
            var blob = new Blob([JSON.stringify(mockBoard, null, 2)], {type : 'application/json'});
            var init = { "status" : 200 , "statusText" : "OK" };
            var myResponse = new Response(blob, init);
            resolve(myResponse);
          });
        break;
        default:
          return new Promise(function(resolve, reject) {
            console.log("Boards request intercepted!");
            simplyActions.getTrelloBoard(trelloBoardId)
            .then(function(result) {
              var board = clone(mockBoard);
              board.id = params.deckBoardId;
              self.setItem("deckBoard" + board.id, JSON.stringify({"trello" : {"board" : params.boardId}}));
              board.title = result.board.name;
              delete board.ETag;
              var blob = new Blob([JSON.stringify(board, null, 2)], {type : 'application/json'});
              var init = { "status" : 200 , "statusText" : "OK" };
              var myResponse = new Response(blob, init);
              resolve(myResponse);
            });
          });
        break;
      }
    }
  },
  "/apps/deck/stacks/:deckBoardId" : {
    "GET" : function(params) {
      var trelloBoardId = getBoardId(params.deckBoardId);
      switch (trelloBoardId) {
        case "deck":
          return;
        break;        
        case "mock":
          return new Promise(function(resolve, reject) {
            console.log("Stacks request intercepted!");
            // var data = JSON.parse('[{"title":"sw-list1","boardId":3,"deletedAt":0,"lastModified":1650992544,"cards":[{"title":"sw-card1","description":"service worker card description","stackId":7,"type":"plain","lastModified":1650992544,"lastEditor":"yvo","createdAt":1650992518,"labels":[],"assignedUsers":[],"attachments":null,"attachmentCount":0,"owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},"order":999,"archived":false,"duedate":null,"deletedAt":0,"commentsUnread":0,"id":7,"ETag":"55bb13a86644ccb2e57dd2193a4c0aea","overdue":0}],"order":999,"id":7,"ETag":"55bb13a86644ccb2e57dd2193a4c0aea"},{"title":"sw-list2","boardId":3,"deletedAt":0,"lastModified":1650992553,"cards":[{"title":"sw-card2","description":"","stackId":8,"type":"plain","lastModified":1650992553,"lastEditor":null,"createdAt":1650992553,"labels":[],"assignedUsers":[],"attachments":null,"attachmentCount":0,"owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},"order":999,"archived":false,"duedate":null,"deletedAt":0,"commentsUnread":0,"id":8,"ETag":"b0479c0cc73c9dd6b3312b20e8b739fc","overdue":0}],"order":999,"id":8,"ETag":"b0479c0cc73c9dd6b3312b20e8b739fc"}]');
            var blob = new Blob([JSON.stringify(mockStacks, null, 2)], {type : 'application/json'});
            var init = { "status" : 200 , "statusText" : "OK" };
            var myResponse = new Response(blob, init);
            resolve(myResponse);
          });
        break;
        default:
          return new Promise(function(resolve, reject) {
            console.log("Stacks request intercepted!");
            simplyActions.getTrelloBoard(trelloBoardId)
            .then(function(result) {
              var stacks = [];
              var boardId = params.deckBoardId;
              result.lists.forEach(function(trelloList) {
                stack = clone(mockStack1);
                delete stack.ETag;
                stack.id = stackId;
                stack.boardId = params.deckBoardId;
                self.setItem("deckStack" + stackId, JSON.stringify({"trello" : {"list" : trelloList.id, "board" : trelloList.idBoard}}));
                self.setItem("trelloList" + trelloList.id, JSON.stringify({"deck" : {"stack" : stackId, "board" : boardId}}));
                stack.title = trelloList.name;
                stack.cards = [];
                var cardOrder = 0;
                
                trelloList.cards.forEach(function(trelloCard) {
                  card = clone(mockCard1);
                  delete card.ETag;
                  
                  card.id = cardId;
                  card.stackId = stackId;
                  card.order = cardOrder;
                  cardOrder++;
                  
                  self.setItem("deckCard" + cardId, JSON.stringify({"trello" : {"pos" : trelloCard.pos, "card" : trelloCard.id, "list" : trelloList.id, "board" : trelloList.idBoard}, "deck" : {"order" : card.order, "card" : card.id, "stack" : card.stackId}}));
                  self.setItem("trelloCard" + trelloCard.id, JSON.stringify({"trello" : {"pos" : trelloCard.pos, "card" : trelloCard.id, "list" : trelloList.id, "board" : trelloList.idBoard}, "deck" : {"order" : card.order, "card" : card.id, "stack" : card.stackId}}));
                  card.title = trelloCard.name;
                  card.description = trelloCard.desc;
                  if (trelloCard.actions) {
                    if (trelloCard.actions.ctime) {
                      card.createdAt = trelloCard.actions.ctime;
                      card.lastModified = trelloCard.actions.ctime;
                    } else if (trelloCard.actions.mtime) {
                      card.createdAt = trelloCard.actions.mtime;
                    }
                    if (trelloCard.actions.mtime) {
                      card.lastModified = trelloCard.actions.mtime;
                    }
                  }
                  
                  stack.cards.push(card);
                  cardId++;
                });
                stacks.push(stack);
                stackId++;
              });
              var blob = new Blob([JSON.stringify(stacks, null, 2)], {type : 'application/json'});
              var init = { "status" : 200 , "statusText" : "OK" };
              var myResponse = new Response(blob, init);
              resolve(myResponse);
            });
          });
        break;
      }
    }
  },
  "/deck/api/v1.0/cards/:deckCardId/comments*" : {
    "GET" : function(params) {
      var cardInfo = self.getItem("deckCard" + params.deckCardId);
      if (!cardInfo){
        return;
      }
      cardInfo = JSON.parse(cardInfo);
      return new Promise(function(resolve, reject) {
        console.log("API Comments request intercepted!");
        simplyDataApi.getCardComments(cardInfo.trello.card)
        .then(function(result) {
          comments = clone(mockComments);
          comments.ocs.data = [];
          result.forEach(function(trelloComment) {
            comment = clone(mockComment1);
            deckComment = self.getItem("trelloComment" + trelloComment.id);
            if (deckComment) {
              commentInfo = JSON.parse(deckComment);
              comment.id = commentInfo.deck.comment;
            } else {
              comment.id = commentId;
              self.setItem("deckComment" + commentId, JSON.stringify({"trello" : {"card" : cardInfo.trello.card}}));
              self.setItem("trelloComment" + trelloComment.id, JSON.stringify({"deck" : {"comment" : commentId}}));
              commentId++;
            }
            comment.objectId = params.deckCardId;
            comment.message = trelloComment.data.text;
            comment.creationDateTime = trelloComment.date;
            comments.ocs.data.push(comment);
          });
          var blob = new Blob([JSON.stringify(comments, null, 2)], {type : 'application/json'});
          var init = { "status" : 200 , "statusText" : "OK" };
          var myResponse = new Response(blob, init);
          resolve(myResponse);
        });
      });
    },
    "POST" : function(params) {
      return new Promise(function(resolve, reject) {
        params.request.clone().json()
        .then(function(deckData) {
          var cardInfo = self.getItem("deckCard" + params.deckCardId);
          if (!cardInfo){
            return resolve(fetch(params.request));
          }
          cardInfo = JSON.parse(cardInfo);
          console.log("API Comments request intercepted!");
          var comment = {
            text : deckData.message
          };
          simplyDataApi.createCardComment(cardInfo.trello.card, comment)
          .then(function(result) {
            var createdComment = clone(mockComment1);
            createdComment.message = result.data.text;
            createdComment.id = commentId;
            self.setItem("deckComment" + commentId, JSON.stringify({"trello" : {"card" : cardInfo.trello.card}}));
            self.setItem("trelloComment" + createdComment.id, JSON.stringify({"deck" : {"comment" : commentId}}));
            commentId++;

            var wrapper = clone(mockComments);
            mockComments.ocs.data = createdComment;
            var blob = new Blob([JSON.stringify(wrapper, null, 2)], {type : 'application/json'});
            var init = { "status" : 200 , "statusText" : "OK" };
            myResponse = new Response(blob, init);
            return resolve(myResponse);
          });
        });
      });
    }
  },
  "/deck/cards/:deckCardId/reorder" : { 
    "PUT" : function(params) {
      var deckCardId = params.deckCardId;
      return new Promise(function(resolve, reject) {
        params.request.clone().json()
        .then(function(deckData) {
          var cardInfo = self.getItem("deckCard" + deckCardId);
          if (!cardInfo) {
            return resolve(fetch(params.request));
          }
          var stackInfo = self.getItem("deckStack" + deckData.stackId);
          if (!stackInfo) {
            return resolve(fetch(params.request));
          }
          stackInfo = JSON.parse(stackInfo);
          cardInfo = JSON.parse(cardInfo);
          var trelloCardId = cardInfo.trello.card;
          var trelloListId = stackInfo.trello.list;
          
          // FIXME: we need to calculate a new pos value for trello;
          var previousCard;
          for (var key in self.storedData) {
            var item = self.storedData[key];
            if (key.match(/deckCard/)) {
              itemInfo = JSON.parse(item);
              if (itemInfo.deck.stack == deckData.stackId) {
                if (itemInfo.deck.order == deckData.order) {
                  previousCard = item;
                }
              }
            }
          }
          newPos = "bottom";
          if (previousCard) {
            previousCard = JSON.parse(previousCard);
            newPos = previousCard.trello.pos - 1;
          }
          // - we have stored the trello positions of each trello card, so we can find out about that;
          // - we should find out what the position is for card that was in that order previously;
          // - and add one;
          if (trelloCardId && trelloListId) {
            var trelloCard = {
              idList : trelloListId,
              pos : newPos
            };

            return simplyDataApi.updateCard(trelloCardId, trelloCard)
            .then(function(trelloCard) {
              return simplyDataApi.getListCards(trelloListId);
            })
            .then(function(trelloCards) {
              var result = [];
              var cardOrder = 0;
              trelloCards.forEach(function(trelloCard) {
                card = clone(mockCard1);
                delete card.ETag;

                deckCard = self.getItem("trelloCard" + trelloCard.id);
                if (deckCard) {
                  cardInfo = JSON.parse(deckCard);
                  card.id = cardInfo.deck.card;
                } else {
                  card.id = cardId;
                  cardId++;
                }
                card.order = cardOrder;
                cardOrder++;
                card.stackId = deckData.stackId;

                self.setItem("deckCard" + cardId, JSON.stringify({"trello" : {"pos" : trelloCard.pos, "card" : trelloCard.id, "list" : trelloCard.idList, "board" : trelloCard.idBoard}, "deck" : {"order" : card.order, "card" : card.id, "stack" : card.stackId}}));
                self.setItem("trelloCard" + trelloCard.id, JSON.stringify({"trello" : {"pos" : trelloCard.pos, "card" : trelloCard.id, "list" : trelloCard.idList, "board" : trelloCard.idBoard}, "deck" : {"order" : card.order, "card" : card.id, "stack" : card.stackId}}));

                card.title = trelloCard.name;
                card.description = trelloCard.desc;
                card.order = parseInt(trelloCard.pos);
                if (trelloCard.actions) {
                  if (trelloCard.actions.ctime) {
                    card.createdAt = trelloCard.actions.ctime;
                    card.lastModified = trelloCard.actions.ctime;
                  } else if (trelloCard.actions.mtime) {
                    card.createdAt = trelloCard.actions.mtime;
                  }
                  if (trelloCard.actions.mtime) {
                    card.lastModified = trelloCard.actions.mtime;
                  }
                }
                result.push(card);
              });
            
              var blob = new Blob([JSON.stringify(result, null, 2)], {type : 'application/json'});
              var init = { "status" : 200 , "statusText" : "OK" };
              myResponse = new Response(blob, init);
              return resolve(myResponse);
            });
          }
        });
      });
    }
  },
  "/deck/cards/:deckCardId" : { 
    "DELETE" : function(params) {
      var deckCardId = params.deckCardId;
      return new Promise(function(resolve, reject) {
        var cardInfo = self.getItem("deckCard" + deckCardId);
        if (!cardInfo) {
          return resolve(fetch(params.request));
        }
        cardInfo = JSON.parse(cardInfo);
        var trelloCard = cardInfo.trello.card;
        if (trelloCard) {
          return simplyDataApi.deleteCard(trelloCard)
          .then(function(trelloCard) {
            var blob = new Blob([JSON.stringify({}, null, 2)], {type : 'application/json'});
            var init = { "status" : 200 , "statusText" : "OK" };
            myResponse = new Response(blob, init);
            return resolve(myResponse);
          });
        }
      });
    },
    "PUT" : function(params) {
      var deckCardId = params.deckCardId;
      return new Promise(function(resolve, reject) {
        params.request.clone().json()
        .then(function(deckData) {
          var cardInfo = self.getItem("deckCard" + deckCardId);
          if (!cardInfo) {
            return resolve(fetch(params.request));
          }
          cardInfo = JSON.parse(cardInfo);
          var trelloCardId = cardInfo.trello.card;
          if (trelloCardId) {
            var trelloCard = {
              name: deckData.title,
              desc: deckData.description
            };

            return simplyDataApi.updateCard(trelloCardId, trelloCard)
            .then(function(trelloCard) {
              var updatedCard = clone(mockCard1);
              updatedCard.title = trelloCard.name;
              updatedCard.description = trelloCard.desc;
              updatedCard.stackId = deckData.stackId;
              updatedCard.id = parseInt(deckCardId);
              updatedCard.createdAt = deckData.createdAt;
              updatedCard.lastModified = deckData.lastModified;
              var blob = new Blob([JSON.stringify(updatedCard, null, 2)], {type : 'application/json'});
              var init = { "status" : 200 , "statusText" : "OK" };
              myResponse = new Response(blob, init);
              return resolve(myResponse);
            });
          }
        });
      });
    }
  },
  "/deck/cards" : {
    "POST" : function(params) {
      return new Promise(function(resolve, reject) {
        params.request.clone().json()
        .then(function(deckData) {
          var stackInfo = self.getItem("deckStack" + deckData.stackId);
          if (!stackInfo) {
            return resolve(fetch(params.request));
          }
          stackInfo = JSON.parse(stackInfo);
          var trelloList = stackInfo.trello.list;
          if (trelloList) {
            var newCard = {
              name: deckData.title,
              pos: "bottom",
              idList: trelloList
            };
            return simplyDataApi.createCard(newCard)
            .then(function(trelloCard) {
              var createdCard = clone(mockCard1);
              createdCard.title = trelloCard.name;
              createdCard.description = trelloCard.desc;
              createdCard.stackId = deckData.stackId;
              createdCard.id = cardId;
              createdCard.lastModified = parseInt(new Date().getTime() /1000);
              createdCard.createdAt = parseInt(new Date().getTime() /1000);
              self.setItem("deckCard" + cardId, JSON.stringify({"trello" : {"card" : trelloCard.id, "list" : trelloList.id, "board" : trelloList.idBoard}}));
              cardId++;
              
              var blob = new Blob([JSON.stringify(createdCard, null, 2)], {type : 'application/json'});
              var init = { "status" : 200 , "statusText" : "OK" };
              myResponse = new Response(blob, init);
              return resolve(myResponse);
            });
          }
        });
      });
    }
  }
};

simplyRoute.load(routes);

/* Defer to simplyRoute */
self.addEventListener('fetch', function(event) {
  var response = simplyRoute.match(event.request, {request : event.request});
  if (response) {
    console.log("fetch for " + event.request.url);
    event.respondWith(response);
  } else {
    event.respondWith(fetch(event.request));
  }
});

/* Raw API */
var simplyRawApi = {
  url : "https://api.trello.com/1/",
  headers : {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  encodeGetParams : function(params) {
    if (!params) {
      return "";
    }
    return "?" + Object.entries(params).map(function(keyvalue) {
      return keyvalue.map(encodeURIComponent).join("=")
    }).join("&");
  },
  get : function(endpoint, params={}) {
    params.key = this.key;
    params.token = this.token;
    return fetch(simplyRawApi.url + endpoint + "/" + simplyRawApi.encodeGetParams(params), {
      mode : 'cors',
      headers: this.headers
    });
  },
  post : function(endpoint, params={}) {
    let auth = {}
    auth.key = this.key;
    auth.token = this.token;
    
    return fetch(simplyRawApi.url + endpoint + "/" + simplyRawApi.encodeGetParams(auth), {
      mode : 'cors',
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(params, null, "\t")
    });
  },
  put : function(endpoint, params={}) {
    let auth = {}
    auth.key = this.key;
    auth.token = this.token;
    
    return fetch(simplyRawApi.url + endpoint + "/" + simplyRawApi.encodeGetParams(auth), {
      mode: 'cors',
      headers: this.headers,
      method: "PUT",
      body: JSON.stringify(params, null, "\t")
    });
  },
  delete : function(endpoint, params={}) {
    params.key = this.key;
    params.token = this.token;
    return fetch(simplyRawApi.url + endpoint + "/" + simplyRawApi.encodeGetParams(params), {
      mode : 'cors',
      headers: this.headers,
      method: "DELETE"
    });
  },
  token : "73a4a4752868d8a7da00f79f72b7a203658361aaf430a572f73ab2a5ee7a58fd",
  key : "7ffc8fb72c8f00564a68a583b05eebe3"
};
/* End of Raw API */

/* Data API */
var simplyDataApi = {
  getBoard : function(boardId) {
    return simplyRawApi.get("boards/" + boardId)
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("getBoard failed", response.status);
    });
  },
  getBoardLists : function(boardId) {
    return simplyRawApi.get("boards/" + boardId + "/lists")
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("getBoardLists failed", response.status);
    });
  },
  getBoardCards : function(boardId) {
    return simplyRawApi.get("boards/" + boardId + "/cards")
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("getBoardCards failed", response.status);
    });
  },
  getListCards : function(listId) {
    return simplyRawApi.get("lists/" + listId + "/cards")
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("getListCards failed", response.status);
    });
  },
  getBoardActions : function(boardId) {
    return simplyRawApi.get("boards/" + boardId + "/actions", {"limit":1000,"filter":"createCard,commentCard,updateCard"})
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("getBoardActions failed", response.status);
    });
  },
  getCardComments : function(cardId) {
    return simplyRawApi.get("cards/" + cardId + "/actions", {"limit":1000,"filter":"commentCard"})
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("getCardComments failed", response.status);
    });
  },
  createCard : function(newCard) {
    return simplyRawApi.post("cards/", newCard)
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("createCard failed", response.status);
    });
  },
  deleteCard : function(cardId) {
    return simplyRawApi.delete("cards/" + cardId)
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("deleteCard failed", response.status);
    });
  },
  updateCard : function(cardId, cardData) {
    return simplyRawApi.put("cards/" + cardId, cardData)
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("updateCard failed", response.status);
    });
  },
  createCardComment : function(cardId, comment) {
    return simplyRawApi.post("cards/" + cardId + "/actions/comments", comment)
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("createCardComment failed", response.status);
    });
  }
};
/* End of Data API */


