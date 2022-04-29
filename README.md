# Deck - Trello bridge for Nextcloud
## This repository is an experimental proof of concept. This code is not ready for use in any production environment!

## Idea
Since both Trello and Nextcloud Deck are API driven, the frontend is only loosely coupled to the backends.

What is we put in a service worker between the Deck frontend (vue) and the Nextcloud backend? 
Would we be able to intercept requests for specific boards, and reroute that to Trello?
Would we be able to show the cards and lists from Trello in a Deck UI, without having to touch a lot of code in Nextcloud?

Could we then have collaboration on the same kanban, with two different web applications working on the same data?

The answer is "yes". This repository contains a proof of concept that does just that.

Currently supported:
- [x] View board name
- [x] View lists
- [x] View cards (title, descriptions)
- [x] View card comments
- [x] Update card title
- [x] Update card description
- [x] Add comments
- [x] Move cards within a list
- [x] Move cards to another list

Not yet supported:
- [ ] Update board name
- [ ] Update list name
- [ ] Create / delete ilsts
- [ ] Card attachments
- [ ] Card labels

## Installation
*Note:* The service worker needs to be in the root to be able to intercept both calls to apps/deck/* and ocs/*

- Link trello-service-worker.js to the root:
```
cd NEXTCLOUD_ROOT
ln -s apps/deck/js/trello-service-worker.js .
```

- Add this to the .htaccess:
```
  <FilesMatch "trello-service-worker.js$">
    Header always unset Content-Security-Policy
  </FilesMatch>
```

- Create a developer key on Trello: https://trello.com/app-key
- Add your credentials to apps/deck/js/trello-config.js
- Add a mapping from your board ID to the board ID in trello. This can be either the long version (as used in the trello API) or the short version (as used in trello urls);

## Development

### Tests

Unit-tests have been created for the Javascript (JS) code.

For JS testing, Qunit is used. To run all tests, open [`tests/js/index.html`](./tests/js/index.html) in a browser.
