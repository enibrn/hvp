import type { Plugin, UserConfig } from 'vite';
import { defineConfig } from 'vitepress';
import { HVPConfig } from './types';
import { DendronNodesImporter } from './dendron-nodes-importer';
import { ConfigBuilder } from './config-builder';
import markdownItWikilinksFn from 'markdown-it-wikilinks';
import mditAsyncFmTitleFn from 'mdit-async-fm-title';

export { HVPConfig } from './types';

// Vite plugin to inject VitePress config using DendronNodesImporter and ConfigBuilder
export function VitePluginHvpDendron(
  options: HVPConfig
): Plugin {
  let configBuilder: ConfigBuilder | undefined;

  return {
    name: 'vite-plugin-hvp-dendron',
    async config(userConfig: UserConfig) {
      const dendronNodeImporter = new DendronNodesImporter(options.srcDir);
      configBuilder = new ConfigBuilder(dendronNodeImporter);
      await configBuilder.resolveConfig();

      // Compose the VitePress config
      const customConfig = defineConfig({
        srcDir: options.srcDir,
        base: options.baseUrl,
        themeConfig: {
          nav: configBuilder.nav,
          sidebar: configBuilder.sidebar
        },
        markdown: {
          config: (md: any) => {
            const options = {
              postProcessLabel: (label: string | number) =>
                configBuilder!.linksVocabulary[label] ?? label
            };

            md.use(markdownItWikilinksFn(options));
            md.use(mditAsyncFmTitleFn);
          }
        },
        srcExclude: configBuilder.srcExclude,
      });

      // Merge with user config if needed
      return {
        ...userConfig,
        ...customConfig,
      };
    }
  };
}
