// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { Uri, workspace } from "vscode";
import { DataNode } from "./dataNode";
import { ExplorerNode } from "./explorerNode";
import { Trie } from "./trie/Trie";
import { TrieNode } from "./trie/TrieNode";

class ExplorerNodeCache {

    private mutableNodeCache: Trie = new Trie();
    private readonlyNodeCache: Map<string, DataNode> = new Map<string, DataNode>();

    public getDataNode(uri: Uri): DataNode | undefined {
        if (this.isInWorkspace(uri)) {
            return this.mutableNodeCache.find(uri.fsPath)?.value;
        } else if (this.isJdtClass(uri)) {
            return this.readonlyNodeCache.get(uri.fsPath);
        }

        return undefined;
    }

    public findParentExplorerNode(uri: Uri): ExplorerNode | undefined {
        if (!this.isInWorkspace(uri)) {
            return undefined;
        }

        return this.mutableNodeCache.findParentExplorerNode(uri.fsPath);
    }

    public saveNode(node: ExplorerNode): void {
        if (node instanceof DataNode) {
            const uri: Uri = Uri.parse(node.uri);
            if (this.isInWorkspace(uri)) {
                this.mutableNodeCache.insert(node);
            } else if (this.isJdtClass(uri)) {
                this.readonlyNodeCache.set(uri.fsPath, node);
            }
        }
    }

    public saveNodes(nodes: ExplorerNode[]): void {
        for (const node of nodes) {
            this.saveNode(node);
        }
    }

    public removeMutableNodeChildren(node: ExplorerNode): void {
        if (!node) {
            this.clearAll();
            return;
        }

        if (!(node instanceof DataNode)) {
            return;
        }

        const uri: Uri = Uri.parse(node.uri);
        if (!this.isInWorkspace(uri)) {
            return;
        }

        const trieNode: TrieNode | undefined = this.mutableNodeCache.find(uri.fsPath);
        if (!trieNode) {
            return;
        }

        trieNode.removeChildren();
        trieNode.value.nodeData.children = undefined;
    }

    private clearAll(): void {
        this.mutableNodeCache.clearAll();
        this.readonlyNodeCache.clear();
    }

    private isInWorkspace(uri: Uri): boolean {
        return !!workspace.getWorkspaceFolder(uri);
    }

    private isJdtClass(uri: Uri): boolean {
        return uri.scheme === "jdt";
    }

}

export const explorerNodeCache: ExplorerNodeCache = new ExplorerNodeCache();
