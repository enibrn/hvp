import type { Plugin, UserConfig } from 'vite';
import { defineConfig, type SiteConfig } from 'vitepress';
import type { HVPConfig } from './types';
import { DendronNodesImporter } from './dendron-nodes-importer';
import { ConfigBuilder } from './config-builder';
import markdownItWikilinksFn from 'markdown-it-wikilinks';
import mditAsyncFmTitleFn from 'mdit-async-fm-title';

import { writeFile, mkdir } from 'fs/promises';

export type { HVPConfig } from './types';

type MyUserConfig = {
  vitepress: SiteConfig,
  base: string;
}

// Vite plugin to inject VitePress config using DendronNodesImporter and ConfigBuilder
export function VitePluginHvp(
  options: HVPConfig
): Plugin {
  let configBuilder: ConfigBuilder | undefined;

  return {
    name: 'vite-plugin-hvp',
    async config(userConfig: UserConfig) {
      // Read from vitepress config
      const myUserConfig = userConfig as MyUserConfig;
      const srcDir: string = myUserConfig.vitepress.srcDir;
      const baseUrl: string = myUserConfig.base;

      // calculate stuff
      const dendronNodeImporter = new DendronNodesImporter(srcDir);
      configBuilder = new ConfigBuilder(dendronNodeImporter);
      await configBuilder.resolveConfig();

      // mutate the options with the configBuilder
      let { themeConfig } = myUserConfig.vitepress.site;
      themeConfig.nav = configBuilder.nav;
      themeConfig.sidebar = configBuilder.sidebar;
    }
  };
}
