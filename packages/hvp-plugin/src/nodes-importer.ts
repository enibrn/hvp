import { HNode } from './types';

export interface INodesImporter {
  do(): Promise<HNode.ImportResult[]>;
}