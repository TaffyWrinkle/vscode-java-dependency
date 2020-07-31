// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { DataNode } from "../dataNode";

export class TrieNode {
    private _key: string;
    private _value: DataNode;
    private _children: INodeChildren;

    constructor(key: string, value: DataNode) {
        this._key = key;
        this._value = value;
        this._children = {};
    }

    public get children(): INodeChildren {
        return this._children;
    }

    public set value(value: DataNode) {
        this._value = value;
    }

    public get value(): DataNode | undefined {
        return this._value;
    }

    public removeChildren(): void {
        this._children = {};
    }
}

interface INodeChildren {
    [key: string]: TrieNode;
}
