# Deck - Trello bridge for Nextcloud

[![PDS Interop][muze-shield]][muze-site]
[![Project stage: Experimental][project-stage-badge: Experimental]][project-stage-page]
[![License][license-shield]][license-link]
[![standard-readme compliant][standard-readme-shield]][standard-readme-link]

<kbd>**⚠ This code is not ready for use in any production environment! ⚠**</kbd>

_Proof of concept front-end bridge from Trello to Nextcloud Deck_

## Background

Since both [Trello](https://trello.com) and [Nextcloud Deck](https://apps.nextcloud.com/apps/deck) are API driven, the frontend is only loosely coupled to the backends.

What if we put in a service worker between the Deck frontend (vue) and the Nextcloud backend? 

- Would we be able to intercept requests for specific boards, and reroute that to Trello?
- Would we be able to show the cards and lists from Trello in a Deck UI, without having to touch a lot of code in Nextcloud?
- Could we then have collaboration on the same kanban, with two different web applications working on the same data?

The answer is "yes". This repository contains a proof of concept that does just that.

## Install

*Note:* The service worker needs to be in the root to be able to intercept both calls to `apps/deck/*` and `ocs/*`

1. Link trello-service-worker.js to the root:
    ```sh
    cd NEXTCLOUD_ROOT
    ln -s apps/deck/js/trello-service-worker.js .
    ```
2. Add this to the .htaccess:
    ```apacheconf
    <FilesMatch "trello-service-worker.js$">
      Header always unset Content-Security-Policy
    </FilesMatch>
    ```
3. Create a developer key on Trello: https://trello.com/app-key
4. Add your credentials to `apps/deck/js/trello-config.js`
5. Add a mapping from your board ID to the board ID in trello. This can be either the long version (as used in the trello API) or the short version (as used in trello urls);

## Usage

Visit the Deck created after the installation steps have been successfully completed.

You should see the Trello Board as a Nextcloud Deck, with all features listed below available.

## Features

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

## Thanks

![NextGov hackathon 2022 logo](https://eventornado-files.ams3.cdn.digitaloceanspaces.com/events/182/6gOrCCJs4Goq9Qcscnw4dCtifEsdLxRcedU19mQn_large.jpeg)

This code was created for the [Nextgov hackathon](https://nextgov-hackathon.eu/) in 2022, as part of the _"Improvements to Deck"_ track.

We would like to thank the Open Source Programme Office at the European Commission ([EC-OSPO](https://joinup.ec.europa.eu/collection/ec-ospo)) and [Nextcloud](https://nextcloud.com/) for making this hackathon possible!

## Contributing

As this code has been created as a proof-of-concept for a hackathon, PRs are not expected (or accepted).

Any questions can be directed at [@YvoBrevoort](https://twitter.com/YvoBrevoort) or [@Potherca](https://twitter.com/Potherca) on Twitter.

## License

This code builds upon [Nextcloud Deck](https://github.com/nextcloud/deck) which is licensed under GNU Affero General Public License v3 or any later version (AGPL-3.0-or-later).

The AGPL-3.0 demands that the original copyright must be retained, hence this project is also licensed under [AGPL-3.0-or-later][license-link].

[license-link]: ./LICENSE
[license-shield]: https://img.shields.io/github/license/muze-nl/nextcloud-deck-trello-bridge.svg
[muze-shield]: https://img.shields.io/badge/%7BU%7D-Muze-BF1E2E.svg?labelColor=BF1E2E
[muze-site]: https://www.muze.nl/
[project-stage-badge: Experimental]: https://img.shields.io/badge/Project%20Stage-Experimental-yellow.svg
[project-stage-page]: https://blog.pother.ca/project-stages/
[standard-readme-link]: https://github.com/RichardLitt/standard-readme
[standard-readme-shield]: https://img.shields.io/badge/-Standard%20Readme-brightgreen.svg
