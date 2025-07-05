import { VitePluginHvp, type HVPConfig } from 'hvp-plugin';

const srcDir = 'notes';
const baseUrl = '/my-vault/';
const config: HVPConfig = {
  lastCreatedItemsToTake: 5,
  lastUpdatedItemsToTake: 5,
  maxExcerptLength: 200
};

export default {
  title: "VitePress",
  srcDir,
  base: baseUrl,
  description: "Vite & Vue powered static site generator.",
  vite: {
    plugins: [VitePluginHvp(config)],
  }
};