import matter from 'gray-matter';
import removeMd from 'remove-markdown';
import { readFile } from 'fs/promises';
import { HNode, type HVPConfig } from './types';

export class ThemeDataProvider {
  public readonly redirects: Record<string, string> = {};
  public readonly newlyCreatedBlogPosts: HNode.BlogPost[] = [];
  public readonly newlyUpdatedBlogPosts: HNode.BlogPost[] = [];

  private readonly baseUrl: string;
  private readonly config: HVPConfig;
  private readonly leafNodes: HNode.Leaf[] = [];

  constructor(config: HVPConfig, leafNodes: HNode.Leaf[], baseUrl?: string) {
    this.baseUrl = baseUrl || '/';
    this.config = config;
    this.leafNodes = leafNodes;
  }

  public async resolveThemeData(): Promise<void> {
    this.populateRedirects();
    await this.fetchNewlyCreatedBlogPosts();
    await this.fetchNewlyUpdatedBlogPosts();
  }

  private async fetchNewlyCreatedBlogPosts() {
    const promises: Promise<HNode.BlogPost>[] = this.leafNodes
      .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
      .slice(0, this.config.lastCreatedItemsToTake)
      .map(async (node) => this.resolveBlogCard(node));

    this.newlyCreatedBlogPosts.push(...await Promise.all(promises));
  }

  private async fetchNewlyUpdatedBlogPosts() {
    const promises: Promise<HNode.BlogPost>[] = this.leafNodes
      .filter(x => !this.newlyCreatedBlogPosts.some(y => y.fileName === x.fileName)) //exclude newly created items
      .sort((a, b) => b.updatedTimestamp - a.updatedTimestamp)
      .slice(0, this.config.lastUpdatedItemsToTake)
      .map(async (node) => this.resolveBlogCard(node));

    this.newlyUpdatedBlogPosts.push(...await Promise.all(promises));
  }

  private async resolveBlogCard(node: HNode.Leaf): Promise<HNode.BlogPost> {
    const fcontent = await readFile(node.filePath, 'utf-8');
    const { content } = matter(fcontent);
    const excerpt = this.getExcerpt(content);
    return {
      ...node,
      excerpt: excerpt
    } as HNode.BlogPost;
  }

  private populateRedirects() {
    this.leafNodes.forEach(node => {
      this.redirects[node.uid] = `${this.baseUrl}${node.fileName}`;
    });
  }

  private getExcerpt(fcontent: string) {
    let contentText = removeMd(fcontent).trim().replace(/\s+/g, ' ');
    const excerpt = contentText.slice(0, this.config.maxExcerptLength);

    if (contentText.length > this.config.maxExcerptLength) {
      return excerpt + '...';
    }

    return excerpt;
  }
}