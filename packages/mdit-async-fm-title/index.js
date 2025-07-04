import matter from 'gray-matter';

const mditAsyncFmTitleFn = (md, options = {}) => {
  const exclude = options.exclude || [];
  const titleKey = options.titleKey || 'title';

  const originalRenderAsync = md.renderAsync.bind(md);
    
    md.renderAsync = async (src, env) => {
      // Exclude paths if specified
      if (env?.path && exclude.some((p) => env.path.includes(p))) {
        return await originalRenderAsync(src, env);
      }

      const { data, content } = matter(src);
      const title = data[titleKey];
      
      let processedSrc = src;
      if (title) {
        // Check if content already starts with an H1 title
        const trimmedContent = content.trim();
        const hasH1Title = trimmedContent.startsWith('# ');
        
        // Only add title if content doesn't already have an H1
        if (!hasH1Title) {
          const titleHeader = `# ${title}\n\n`;
          const newContent = titleHeader + content;
          processedSrc = matter.stringify(newContent, data);
        }
      }
      
      return await originalRenderAsync(processedSrc, env);
    };
};

export default mditAsyncFmTitleFn;
