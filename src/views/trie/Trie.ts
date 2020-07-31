// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as path from "path";
import { Uri } from "vscode";
import { DataNode } from "../dataNode";
import { ExplorerNode } from "../explorerNode";
import { TrieNode } from "./TrieNode";

export class Trie {
    private root: TrieNode;

    constructor() {
        this.root = new TrieNode(null, null);
    }

    public insert(input: DataNode): void {
        let currentNode: TrieNode = this.root;
        const fsPath: string = Uri.parse(input.uri).fsPath;
        const segments: string[] = fsPath.split(path.sep);

        for (const segment of segments) {
            if (!segment) {
                continue;
            }
            if (!currentNode.children[segment]) {
                currentNode.children[segment] = new TrieNode(segment, null);
            }
            currentNode = currentNode.children[segment];
        }

        currentNode.value = input;
    }

    public find(fsPath: string): TrieNode | undefined {
        let currentNode = this.root;
        const segments: string[] = fsPath.split(path.sep);

        for (const segment of segments) {
            if (!segment) {
                continue;
            }
            if (currentNode.children[segment]) {
                currentNode = currentNode.children[segment];
            } else {
                return undefined;
            }
        }

        return currentNode;
    }

    public findParentExplorerNode(fsPath: string): ExplorerNode | undefined {
        let currentNode: TrieNode = this.root;
        let res: TrieNode | undefined;
        const segments: string[] = fsPath.split(path.sep);

        for (const segment of segments) {
            if (!segment) {
                continue;
            }
            if (currentNode.children[segment]) {
                currentNode = currentNode.children[segment];
            } else {
                break;
            }

            if (currentNode.value) {
                res = currentNode;
            }
        }

        return res?.value?.getParent();
    }

    public clearAll(): void {
        this.root.removeChildren();
    }
}
