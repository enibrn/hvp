import { HNode } from './types';

/**
 * Creates missing virtual vpnodes given the imported nodes.
 * @param nodes List of imported (physical) nodes
 * @returns Array of intermediate virtual vpnodes
 */
export function createVirtualNodes(nodes: HNode.Imported[]): HNode.Virtual[] {
  const existingPaths = new Set(nodes.map(node => node.fileName));
  const virtualNodesToCreate: HNode.Virtual[] = [];

  for (const node of nodes) {
    const parts = node.fileName.split('.');

    for (let i = 1; i < parts.length; i++) {
      const intermediatePath = parts.slice(0, i + 1).join('.');

      if (!existingPaths.has(intermediatePath)) {
        const lastPart = parts[i];
        const level = i + 1;

        const virtualNode: HNode.Virtual = {
          fileName: intermediatePath,
          lastPart: lastPart,
          uid: intermediatePath,
          title: lastPart,
          docEntrypoint: false,
          order: 0,
          level: level
        };

        virtualNodesToCreate.push(virtualNode);
        existingPaths.add(intermediatePath);
      }
    }
  }

  return virtualNodesToCreate;
}