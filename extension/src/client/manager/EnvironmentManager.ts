/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, BaseEnvironment, Logger, WorkspaceFolder } from "vrealize-common"
import * as vscode from "vscode"

import { extensionShortName } from "../constants"

import { ConfigurationManager } from "./ConfigurationManager"

@AutoWire
export class EnvironmentManager extends BaseEnvironment {
    protected readonly logger = Logger.get("EnvironmentManager")

    public get workspaceFolders(): WorkspaceFolder[] {
        return vscode.workspace.workspaceFolders || []
    }

    constructor(protected config: ConfigurationManager) {
        super()

        this.logger.debug("Registering the environment manager...")
    }

    public get displayName(): string {
        return extensionShortName
    }
}