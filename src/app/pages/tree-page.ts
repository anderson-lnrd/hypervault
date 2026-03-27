import { Component, ViewChild } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import { HyperTree, HyperTreeNode } from 'hypervault/tree';
@Component({
  selector: 'app-tree-page',
  imports: [HyperTree, HyperTreeNode, HyperButton],
  templateUrl: './tree-page.html',
})
export class TreePage {
  @ViewChild('treeActions') treeActions!: HyperTree;
}
