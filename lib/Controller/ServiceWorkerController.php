<?php
/**
 * @copyright Copyright (c) 2016 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license GNU AGPL version 3 or any later version
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Deck\Controller;

use OCA\Deck\AppInfo\Application;
use OCA\Deck\Service\ConfigService;
use OCA\Deck\Service\PermissionService;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\IInitialStateService;
use OCP\IRequest;
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Controller;

class ServiceWorkerController extends Controller {
	private $permissionService;
	private $userId;
	private $l10n;
	private $initialState;
	private $configService;

	public function __construct(
		$AppName,
		IRequest $request,
		PermissionService $permissionService,
		IInitialStateService $initialStateService,
		ConfigService $configService
		) {
		parent::__construct($AppName, $request);

		$this->permissionService = $permissionService;
		$this->initialState = $initialStateService;
		$this->configService = $configService;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function config() {
		// FIXME: this information should come from the user / board configs
		$contents = file_get_contents(__DIR__ . "/../../js/trello-config.js");
		$contents = json_decode($contents, true);
		return new JSONResponse($contents, 200); // FIXME: Use nextcloud native JsonResponse
	}
}
