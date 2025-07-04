import matter from 'gray-matter';
import { readdir, readFile } from 'fs/promises';
import path, { basename, extname } from 'path';
import { HNode } from './types.ts';
import { INodesImporter } from './nodes-importer.ts';

export class DendronNodesImporter implements INodesImporter {
  private readonly nodesPath: string;

  constructor(nodesPath: string) {
    this.nodesPath = nodesPath;
  }

  public async do(): Promise<HNode.ImportResult[]> {
    const results: HNode.ImportResult[] = [];
    const filesToExclude: string[] = ['root.md', 'index.md', 'README.md'];
    const files: string[] = await readdir(this.nodesPath);
    const markdownFiles: string[] = files
      .filter(file => extname(file) === '.md' && !filesToExclude.includes(file));
    for (const file of markdownFiles) {
      results.push(await this.importNodeFromFile(file));
    }
    return results;
  }

  private async importNodeFromFile(fileNameWithExt: string): Promise<HNode.ImportResult> {
    const fileName: string = basename(fileNameWithExt, extname(fileNameWithExt));
    const lastPart: string = fileName.split('.').pop() || '';
    const filePath: string = path.join(this.nodesPath, fileNameWithExt);

    let data: any = {};
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      ({ data } = matter(fileContent));
    } catch (e) {
      const fileReadErrorMessage: string = 'Error when reading file ' + (e instanceof Error ? e.message : String(e));
      return {
        fileName, lastPart, fileNameWithExt, filePath,
        errors: [fileReadErrorMessage]
      } as HNode.Failed;
    }

    const errors: string[] = [];
    const prefix = 'Field missing: ';
    if (!data.id) errors.push(`${prefix}id`);
    if (!data.title) errors.push(`${prefix}title`);

    let createdDate: Date | undefined;
    if (!data.created) {
      errors.push(`${prefix}created`);
    } else {
      createdDate = new Date(data.created);
      if (isNaN(createdDate.getTime())) {
        errors.push('Invalid created date');
      }
    }

    let updatedDate: Date | undefined;
    if (!data.updated) {
      errors.push(`${prefix}updated`);
    } else {
      updatedDate = new Date(data.updated);
      if (isNaN(updatedDate.getTime())) {
        errors.push('Invalid updated date');
      }
    }

    if (errors.length > 0) {
      return { fileName, lastPart, fileNameWithExt, filePath, errors } as HNode.Failed;
    }

    return {
      fileName, lastPart, fileNameWithExt, filePath,
      uid: data.id,
      title: data.title,
      createdTimestamp: data.created,
      updatedTimestamp: data.updated,
      docEntrypoint: DendronNodesImporter.resolveDoc(data),
      order: typeof data.nav_order === 'number' ? data.nav_order : 999,
      level: fileName.split('.').length,
      createdDate,
      updatedDate,
      link: '/' + fileName
    } as HNode.Imported;
  }

  private static resolveDoc(data: any): HNode.DocEntryInfo | false {
    if (!data.hvp
      || typeof data.hvp !== 'object'
      || !data.hvp.doc
      || (typeof data.hvp.doc !== 'object' && typeof data.hvp.doc !== 'boolean')
      || (typeof data.hvp.doc === 'boolean' && !data.hvp.doc)) {
      return false;
    }

    let leafLandingPoint: 'first' | 'last' = 'first';
    let collapseNonLandingChildren = false;

    if (typeof data.hvp.doc === 'boolean' && data.hvp.doc) {
      return { leafLandingPoint, collapseNonLandingChildren };
    }

    if (data.hvp.doc.leafLandingPoint && (data.hvp.doc.leafLandingPoint === 'first' || data.hvp.doc.leafLandingPoint === 'last')) {
      leafLandingPoint = data.hvp.doc.leafLandingPoint;
    }

    if (data.hvp.doc.collapseOtherFirstLevels && typeof data.hvp.doc.collapseOtherFirstLevels === 'boolean') {
      collapseNonLandingChildren = data.hvp.doc.collapseOtherFirstLevels;
    }

    return {
      leafLandingPoint,
      collapseNonLandingChildren
    };
  }
}