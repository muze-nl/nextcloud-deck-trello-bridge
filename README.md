*Note*: This code is not ready for use in any production environment!

The service worker needs to be in the root to be able to intercept both calls to apps/deck/* and ocs/*

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
