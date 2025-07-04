import type { DefaultTheme } from 'vitepress';
import { HNode } from './types';
import type { INodesImporter } from './nodes-importer';
import { createVirtualNodes } from './utils';

export class ConfigBuilder {
  public readonly nav: DefaultTheme.NavItem[] = [];
  public readonly sidebar: DefaultTheme.SidebarMulti = {};
  public readonly linksVocabulary: Record<string, string> = {};
  public readonly leafNodes: HNode.Leaf[] = [];
  public readonly srcExclude: string[] = [];

  private readonly nodesImporter: INodesImporter;
  private readonly nodes: HNode.Resolved[] = [];
  private readonly sidebarLeafLinks: Record<string, string> = {};

  constructor(fileparser: INodesImporter) {
    this.nodesImporter = fileparser;
  }

  public async resolveConfig(): Promise<void> {
    await this.resolveNodes();
    this.traverseItemsHierarchically();
  }

  private async resolveNodes() {
    const parsedNodes: HNode.ImportResult[] = await this.nodesImporter.do();

    const failedNodes: HNode.Failed[] = parsedNodes.filter(HNode.isError);
    if (failedNodes.length > 0) {
      failedNodes.forEach(node => {
        console.error(`Error in node ${node.fileName}:`, node.errors.join(', '));
      });
    }

    const successfulNodes: HNode.Imported[] = parsedNodes.filter(HNode.isImported);

    if (successfulNodes.length === 0) {
      throw new Error('No valid nodes found to build the configuration.');
    }

    this.nodes.push(...successfulNodes);

    // Crea i virtual HNode. tramite la funzione utility
    const virtualNodes = createVirtualNodes(successfulNodes);
    this.nodes.push(...virtualNodes);
  }

  private traverseItemsHierarchically() {
    const highestNodesOrdered = this.nodes
      .filter(x => x.level === 1)
      .sort((a, b) => a.order - b.order);

    highestNodesOrdered.forEach(node => {
      this.nav.push(this.traverseUntilDocEntry(node, []));
    });
  }

  private traverseUntilDocEntry(
    node: HNode.Resolved,
    breadcrumbs: string[]
  ): DefaultTheme.NavItem {
    breadcrumbs.push(node.title);

    if (HNode.isImported(node))
      this.srcExclude.push(node.fileNameWithExt);

    const childNodes: HNode.Resolved[] = this.getChildsOrdered(node);

    if (node.docEntrypoint) {
      const landingPoint = node.docEntrypoint.leafLandingPoint;
      const sidebarItems = [] as DefaultTheme.SidebarItem[];
      childNodes.forEach(childNode => {
        sidebarItems.push(this.traverseAfterDocEntry(childNode, node.fileName, landingPoint, [...breadcrumbs]));
      });
      this.sidebar[node.fileName] = sidebarItems;

      //gets the proper preselected leaf page
      const link: string = this.sidebarLeafLinks[node.fileName];

      //manage the collapse of non-landing children
      if (node.docEntrypoint.collapseNonLandingChildren) {
        const nodeToExpandLink = childNodes
          .map(x => x.fileName)
          .find(x => link.startsWith('/' + x + '.'));

        for (let sidebarItem of sidebarItems) {
          if (sidebarItem.link === nodeToExpandLink) {
            sidebarItem.collapsed = false;
          } else {
            sidebarItem.collapsed = true;
          }
        }
      }

      return {
        text: node.title,
        link
      } as DefaultTheme.NavItemWithLink;
    } else {
      const items: DefaultTheme.NavItem[] = [];
      childNodes.forEach(childNode => {
        items.push(this.traverseUntilDocEntry(childNode, [...breadcrumbs]));
      });

      return {
        text: node.title,
        items
      } as DefaultTheme.NavItemWithChildren;
    }
  }

  private traverseAfterDocEntry(
    node: HNode.Resolved,
    navKey: string,
    landingPoint: HNode.LeafLandingPoint,
    breadcrumbs: string[]
  ): DefaultTheme.SidebarItem {
    const result = { key: node.fileName, text: node.title } as DefaultTheme.SidebarItem;
    const childItems: HNode.Resolved[] = this.getChildsOrdered(node);

    if (HNode.isImported(node) && childItems.length == 0) {
      // If the node has no children, it is a leaf node
      result.link = node.link;
      this.linksVocabulary[node.fileName] = node.title;
      this.leafNodes.push({ ...node, breadcrumbs: [...breadcrumbs] });

      // if landingPoint is 'last', always overwrite the link so the last one remains
      // if landingPoint is 'first', only set if there is no link yet, so it wont be overwritten and the first one remains
      if (landingPoint === 'last' || !this.sidebarLeafLinks[navKey])
        this.sidebarLeafLinks[navKey] = result.link;
    } else {
      breadcrumbs.push(node.title);
      // If the node still has children, we need to traverse them
      result.items = [] as DefaultTheme.SidebarItem[];
      childItems.forEach(childItem => {
        result.items?.push(
          this.traverseAfterDocEntry(childItem, navKey, landingPoint, [...breadcrumbs]));
      });

      if (HNode.isImported(node))
        this.srcExclude.push(node.fileNameWithExt);
    }

    return result;
  }

  private getChildsOrdered(father: HNode.Resolved): HNode.Resolved[] {
    const childs = this.nodes
      .filter(node => {
        const regex = new RegExp(`^${father.fileName}\\.([^\\.]+)$`);
        return regex.test(node.fileName);
      });

    return childs.sort((a, b) => a.order - b.order);
  }
}