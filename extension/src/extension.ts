/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

require("module-alias/register")

import { LogChannel, Logger, LogLevel } from "vrealize-common"
import * as vscode from "vscode"

import { ModuleRegistry } from "./client"
import * as command from "./client/command"
import { Commands, OutputChannels } from "./client/constants"
import * as lang from "./client/lang"
import * as lint from "./client/lint"
import * as manager from "./client/manager"
import * as provider from "./client/provider"
import * as ui from "./client/ui"

const logger = Logger.get("extension")
let langServices: lang.LanguageServices

export async function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration("vrdev")
    Logger.setup(getLoggingChannel(), config.get<LogLevel>("log"))

    logger.info("\n\n=== Activating vRealize Developer Tools ===\n")

    const registry = new ModuleRegistry(context)
    registry.registerModules(manager, lang)

    langServices = registry.get(lang.LanguageServices)
    await langServices.initialize()

    const configManager = registry.get(manager.ConfigurationManager)
    configManager.forceLoadProfiles() // initial load and send to LS

    registry.registerModules(ui, command, lint, provider)

    const statusBar = registry.get(ui.StatusBarController)
    if (statusBar.verifyConfiguration()) {
        vscode.commands.executeCommand(Commands.TriggerServerCollection)
    }
}

export async function deactivate() {
    await langServices.dispose()
    logger.info("\n\n=== Deactivated vRealize Developer Tools ===\n")
}

function getLoggingChannel(): LogChannel {
    const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel(OutputChannels.ExtensionLogs)

    return {
        debug(message: string) {
            outputChannel.appendLine(message)
        },

        info(message: string) {
            outputChannel.appendLine(message)
        },

        warn(message: string) {
            outputChannel.appendLine(message)
        },

        error(message: string) {
            outputChannel.appendLine(message)
        }
    }
}
