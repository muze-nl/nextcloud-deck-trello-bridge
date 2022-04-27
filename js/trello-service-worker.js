self.addEventListener('install', function(e) {
  console.log("service worker reporting for duty");
  return self.skipWaiting();
});
self.addEventListener('activate', function(event) {
  console.log("service worker activated");
  return self.clients.claim();
});

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

var mockComments = {
  "ocs":{
    "meta":{"status":"ok","statuscode":200,"message":"OK"},
    "data":[
      {
        "id":26,
        "objectId":1,
        "message":"service worker says hello",
        "actorId":"yvo",
        "actorType":"users",
        "actorDisplayName":"Yvo Brevoort",
        "creationDateTime":"2022-04-27T19:03:37+00:00",
        "mentions":[]
      }
    ]
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
function getBoardId(deckBoardId) {
  if (typeof boardMapping[deckBoardId] === "undefined") {
    boardId = "deck";
  } else {
    boardId = boardMapping[deckBoardId];
  }
  return boardId;
}

function interceptDeckApi(request) {
  console.log("Intercepting deck api request for " + request.url);
  let urlParts = request.url.split("/");
  while(urlParts && (urlParts[0] !== "deck")) {
    urlParts.shift();
  }
  switch(urlParts[1]) {
    case "stacks":
      var params = {
        boardId : getBoardId(urlParts[2])
      }
      switch (params.boardId) {
        case "deck":
          return fetch(request);
        break;        
        case "mock":
          return new Promise(function(resolve, reject) {
            console.log("Stacks request intercepted!");
            // var data = JSON.parse('[{"title":"sw-list1","boardId":3,"deletedAt":0,"lastModified":1650992544,"cards":[{"title":"sw-card1","description":"service worker card description","stackId":7,"type":"plain","lastModified":1650992544,"lastEditor":"yvo","createdAt":1650992518,"labels":[],"assignedUsers":[],"attachments":null,"attachmentCount":0,"owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},"order":999,"archived":false,"duedate":null,"deletedAt":0,"commentsUnread":0,"id":7,"ETag":"55bb13a86644ccb2e57dd2193a4c0aea","overdue":0}],"order":999,"id":7,"ETag":"55bb13a86644ccb2e57dd2193a4c0aea"},{"title":"sw-list2","boardId":3,"deletedAt":0,"lastModified":1650992553,"cards":[{"title":"sw-card2","description":"","stackId":8,"type":"plain","lastModified":1650992553,"lastEditor":null,"createdAt":1650992553,"labels":[],"assignedUsers":[],"attachments":null,"attachmentCount":0,"owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},"order":999,"archived":false,"duedate":null,"deletedAt":0,"commentsUnread":0,"id":8,"ETag":"b0479c0cc73c9dd6b3312b20e8b739fc","overdue":0}],"order":999,"id":8,"ETag":"b0479c0cc73c9dd6b3312b20e8b739fc"}]');
            var blob = new Blob([JSON.stringify(mockStacks, null, 2)], {type : 'application/json'});
            var init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
            var myResponse = new Response(blob, init);
            resolve(myResponse);
          });
        break;
        default:
          return new Promise(function(resolve, reject) {
            console.log("Stacks request intercepted!");
            
            Promise.all(
              [
                simplyDataApi.getBoard(params.boardId),
                simplyDataApi.getBoardLists(params.boardId),
                simplyDataApi.getBoardCards(params.boardId),
                simplyDataApi.getBoardActions(params.boardId)
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
            }).then(function(result) {
              var stacks = [];
              var boardId = urlParts[2];
              var stackId = 1000001;
              var cardId = 1000001;
              result.lists.forEach(function(trelloList) {
                stack = clone(mockStack1);
                delete stack.ETag;
                stack.id = stackId;
                stack.boardId = boardId;
                stack.title = trelloList.name;
                stack.cards = [];
                trelloList.cards.forEach(function(trelloCard) {
                  card = clone(mockCard1);
                  delete card.ETag;
                  
                  card.id = cardId;
                  card.stackId = stackId;
                  card.title = trelloCard.name;
                  card.description = trelloCard.desc;
                  console.log(trelloCard);
                  
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
              var init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
              var myResponse = new Response(blob, init);
              resolve(myResponse);
            });
          });
        break;
      }
    break;
    case "boards":
      var params = {
        boardId : getBoardId(urlParts[2])
      }
      switch (params.boardId) {
        case "deck":
          return fetch(request);
        break;
        case "mock":
          return new Promise(function(resolve, reject) {
            console.log("Boards request intercepted!");
            // var data = JSON.parse('{"title":"Service worker - Trello bridge","owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},"color":"312438","archived":false,"labels":[{"title":"Finished","color":"31CC7C","boardId":3,"cardId":null,"lastModified":1650963821,"id":9,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"To review","color":"317CCC","boardId":3,"cardId":null,"lastModified":1650963821,"id":10,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"Action needed","color":"FF7A66","boardId":3,"cardId":null,"lastModified":1650963821,"id":11,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"Later","color":"F1DB50","boardId":3,"cardId":null,"lastModified":1650963821,"id":12,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"}],"acl":[{"participant":{"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":1},{"participant":{"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":2}],"permissions":{"PERMISSION_READ":true,"PERMISSION_EDIT":true,"PERMISSION_MANAGE":true,"PERMISSION_SHARE":true},"users":[{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},{"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},{"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0}],"stacks":[],"deletedAt":0,"lastModified":1650992553,"settings":{"notify-due":"assigned","calendar":true},"id":3,"ETag":"b0479c0cc73c9dd6b3312b20e8b739fc"}');
            var blob = new Blob([JSON.stringify(mockBoard, null, 2)], {type : 'application/json'});
            var init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
            var myResponse = new Response(blob, init);
            resolve(myResponse);
          });
        break;
        default:
          return new Promise(function(resolve, reject) {
            console.log("Boards request intercepted!");
            
            Promise.all(
              [
                simplyDataApi.getBoard(params.boardId),
                simplyDataApi.getBoardLists(params.boardId),
                simplyDataApi.getBoardCards(params.boardId),
                simplyDataApi.getBoardActions(params.boardId)
              ]
            ).then(function(result) {
              var sortedCards = {};
              result[2].forEach(function(card) {
                if (typeof sortedCards[card.idList] === "undefined") {
                  sortedCards[card.idList] = [];
                }
                sortedCards[card.idList].push(card);
              });
              result[1].forEach(function(list, index) {
                if (sortedCards[list.id]) {
                  result[1][index].cards = sortedCards[list.id];
                }
              });
              return {
                board : result[0],
                lists : result[1]
              }
            }).then(function(result) {
              var board = clone(mockBoard);
              board.id = urlParts[2];
              board.title = result.board.name;
              delete board.ETag;
              var blob = new Blob([JSON.stringify(board, null, 2)], {type : 'application/json'});
              var init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
              var myResponse = new Response(blob, init);
              resolve(myResponse);
            });
          });
        break;
      }
    break;
    case "api":
      return fetch(request);
      
      // FIXME: the api call is done on a card id, but we have no translation of cardId to boardId or trello id.
      
      if (
        (urlParts[2] == "v1.0") &&
        (urlParts[3] == "cards")
      ) {
        // check if the ID is a trello card, if so, hijack the request;

        let action = urlParts[5].split("?")[0];
        switch (action) {
          case "comments":
            switch (getBoardId(boardId)) {
              case "deck":
                return fetch(request);
              break;
              case "mock":
                return new Promise(function(resolve, reject) {
                  console.log("Boards request intercepted!");
                  // var data = JSON.parse('{"title":"Service worker - Trello bridge","owner":{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},"color":"312438","archived":false,"labels":[{"title":"Finished","color":"31CC7C","boardId":3,"cardId":null,"lastModified":1650963821,"id":9,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"To review","color":"317CCC","boardId":3,"cardId":null,"lastModified":1650963821,"id":10,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"Action needed","color":"FF7A66","boardId":3,"cardId":null,"lastModified":1650963821,"id":11,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"},{"title":"Later","color":"F1DB50","boardId":3,"cardId":null,"lastModified":1650963821,"id":12,"ETag":"ed0dda5c712fd25c84d20a3aacde9fc4"}],"acl":[{"participant":{"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":1},{"participant":{"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0},"type":0,"boardId":3,"permissionEdit":true,"permissionShare":false,"permissionManage":false,"owner":false,"id":2}],"permissions":{"PERMISSION_READ":true,"PERMISSION_EDIT":true,"PERMISSION_MANAGE":true,"PERMISSION_SHARE":true},"users":[{"primaryKey":"yvo","uid":"yvo","displayname":"Yvo Brevoort","type":0},{"primaryKey":"auke","uid":"auke","displayname":"Auke van Slooten","type":0},{"primaryKey":"ben","uid":"ben","displayname":"Ben Peachey","type":0}],"stacks":[],"deletedAt":0,"lastModified":1650992553,"settings":{"notify-due":"assigned","calendar":true},"id":3,"ETag":"b0479c0cc73c9dd6b3312b20e8b739fc"}');
                  var blob = new Blob([JSON.stringify(mockComments, null, 2)], {type : 'application/json'});
                  var init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
                  var myResponse = new Response(blob, init);
                  resolve(myResponse);
                });
              break;
              default:
              break;
            }
          break;
          default:
            return fetch(request);
          break;
        }
      }
    break;
    default:
      return fetch(request);
    break
  }
}

/* Network then cache */
self.addEventListener('fetch', function(event) {
  console.log("fetch for " + event.request.url);
  if (event.request.url.match(/\/deck\/(stacks|boards)\//)) {
    event.respondWith(interceptDeckApi(event.request));
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
  getBoardActions : function(boardId) {
    return simplyRawApi.get("boards/" + boardId + "/actions", {"limit":1000,"filter":"createCard,commentCard,updateCard"})
      .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("getBoardActions failed", response.status);
    });
  }
};
/* End of Data API */
