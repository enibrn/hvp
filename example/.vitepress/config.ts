import { VitePluginHvpDendron, type HVPConfig } from 'hvp-plugin';

const config: HVPConfig = {
  srcDir: 'notes',
  baseUrl: '/my-vault/',
  blog: {
    lastCreatedItemsToTake: 5,
    lastUpdatedItemsToTake: 5,
    maxExcerptLength: 200
  }
};

export default {
  title: "VitePress",
  description: "Vite & Vue powered static site generator.",
  vite: {
    plugins: [VitePluginHvpDendron(config)],
  }
};