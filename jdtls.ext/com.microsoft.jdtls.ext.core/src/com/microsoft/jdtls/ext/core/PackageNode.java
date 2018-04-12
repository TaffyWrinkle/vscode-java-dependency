/*******************************************************************************
 * Copyright (c) 2017 Microsoft Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Microsoft Corporation - initial API and implementation
 *******************************************************************************/

package com.microsoft.jdtls.ext.core;

import java.util.List;

import org.eclipse.core.runtime.IPath;

/**
 * Represent a ClasspathNode in the project view.
 */
public class PackageNode {

	/**
	 * The name of the ClasspathNode
	 */
	private String name;

	/**
	 * The module name of the ClasspathNode for Java 9 and above
	 */
	private String moduleName;

	/**
	 * The type of {@link IPath} portable string value
	 */
	private String path;

	/**
	 * The URI value of the ClasspathNode
	 */
	private String uri;

	/**
	 * ClasspathNode kind
	 */
	private NodeKind kind;

	/**
	 * ClasspathNode children list
	 */
	private List<PackageNode> children;

	public PackageNode() {

	}

	public PackageNode(String name, String path, NodeKind kind) {
		this.name = name;
		this.path = path;
		this.kind = kind;
	}

	public String getName() {
		return name;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public String getModuleName() {
		return moduleName;
	}

	public String getPath() {
		return path;
	}

	public NodeKind getKind() {
		return kind;
	}

	public String getUri() {
		return this.uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public List<PackageNode> getChildren() {
		return this.children;
	}

	public void setChildren(List<PackageNode> children) {
		this.children = children;
	}
}