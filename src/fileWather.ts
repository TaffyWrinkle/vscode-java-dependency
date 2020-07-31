// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as path from "path";
import { commands, Disposable, FileSystemWatcher, Uri, workspace } from "vscode";
import { instrumentOperation } from "vscode-extension-telemetry-wrapper";
import { Commands } from "./commands";
import { Settings } from "./settings";
import { DataNode } from "./views/dataNode";
import { ExplorerNode } from "./views/explorerNode";
import { explorerNodeCache } from "./views/explorerNodeCache";

const ENABLE_AUTO_REFRESH: string = "java.view.package.enableAutoRefresh";
const DISABLE_AUTO_REFRESH: string = "java.view.package.disableAutoRefresh";

class SyncHandler implements Disposable {

    private disposables: Disposable[] = [];

    public updateFileWatcher(autoRefresh: boolean): void {
        if (autoRefresh) {
            instrumentOperation(ENABLE_AUTO_REFRESH, () => this.enableAutoRefresh())();
        } else {
            instrumentOperation(DISABLE_AUTO_REFRESH, () => this.dispose())();
        }
    }

    public dispose(): void {
        for (const disposable of this.disposables) {
            if (disposable) {
                disposable.dispose();
            }
        }
        this.disposables = [];
    }

    private async enableAutoRefresh() {
        this.disposables.push(workspace.onDidChangeWorkspaceFolders(() => {
            this.refresh();
        }));

        const fileSystemWatcher: FileSystemWatcher = workspace.createFileSystemWatcher("**/{*.java,src/**}");
        this.setupWatchers(fileSystemWatcher);
        this.disposables.push(fileSystemWatcher);
    }

    private setupWatchers(watcher: FileSystemWatcher): void {
        this.disposables.push(watcher.onDidChange((uri: Uri) => {
            if (path.extname(uri.fsPath) !== ".java" || !Settings.showMembers()) {
                return;
            }
            const node: DataNode | undefined = explorerNodeCache.getDataNode(uri);
            this.refresh(node);
        }));

        this.disposables.push(watcher.onDidCreate((uri: Uri) => {
            const node: ExplorerNode | undefined = explorerNodeCache.findParentExplorerNode(uri);
            this.refresh(node);
        }));

        this.disposables.push(watcher.onDidDelete((uri: Uri) => {
            const node: ExplorerNode | undefined = explorerNodeCache.findParentExplorerNode(uri);
            this.refresh(node);
        }));

    }

    private refresh(node?: ExplorerNode): void {
        commands.executeCommand(Commands.VIEW_PACKAGE_REFRESH, /* debounce = */true, node);
    }
}

export const syncHandler: SyncHandler = new SyncHandler();
