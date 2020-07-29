// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as path from "path";
import { Uri } from "vscode";
import { DataNode } from "./dataNode";
import { ExplorerNode } from "./explorerNode";

class ExplorerNodeModel {

    private sourceNodeMapping: Map<string, DataNode> = new Map<string, DataNode>();

    public getNodeByUri(uri: string): DataNode | undefined {
        return this.sourceNodeMapping.get(uri);
    }

    public saveNode(node: ExplorerNode): void {
        if (!(node instanceof DataNode)) {
            return;
        }
        const parsedUriString: string = Uri.parse(node.uri).toString();
        if (path.extname(parsedUriString) !== ".java") {
            return;
        }
        this.sourceNodeMapping.set(parsedUriString, node);
    }

    public saveNodes(nodes: ExplorerNode[]): void {
        for (const node of nodes) {
            this.saveNode(node);
        }
    }

    public clearAll(): void {
        this.sourceNodeMapping.clear();
    }
}

export const explorerNodeModel: ExplorerNodeModel = new ExplorerNodeModel();
