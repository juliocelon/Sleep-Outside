const fs = require('fs-extra');
const path = require('path');

async function buildForProduction() {
  console.log('🚀 Building for production...');
  
  // Ensure docs directory exists and is clean
  await fs.emptyDir('docs');
  
  // Copy all src files to docs
  await fs.copy('src', 'docs');
  
  // Update ALL HTML files for production
  await updateAllHTMLFiles();
  
  // Fix utils.mjs with robust basePath detection
  await fixUtilsBasePath();
  
  // Fix checkout page to load main.js
  await fixCheckoutPageScript();
  
  console.log('✅ Production build complete!');
  console.log('📁 Files are in the docs/ folder');
  console.log('🌐 Works in both local development and GitHub Pages');
}

async function updateAllHTMLFiles() {
  const htmlFiles = await findHTMLFiles('docs');
  
  for (const file of htmlFiles) {
    await updateHTMLFile(file);
  }
}

async function findHTMLFiles(dir) {
  let results = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory()) {
      results = results.concat(await findHTMLFiles(itemPath));
    } else if (item.endsWith('.html')) {
      results.push(itemPath);
    }
  }
  
  return results;
}

async function updateHTMLFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  
  // Calculate relative path from docs root
  const relativePath = path.relative('docs', path.dirname(filePath));
  const depth = relativePath ? relativePath.split(path.sep).length : 0;
  const basePath = depth === 0 ? './' : '../'.repeat(depth);
  
  console.log(`📄 Updating: ${filePath} (depth: ${depth}, basePath: ${basePath})`);
  
  // Apply path transformations
  content = updateHTMLPaths(content, basePath, filePath);
  
  await fs.writeFile(filePath, content);
}

function updateHTMLPaths(content, basePath, filePath) {
  const isPartial = filePath.includes('partials');
  
  if (isPartial) {
    // For partials, use root-relative paths since they're included in different locations
    return content
      .replace(/href="\/docs\//g, 'href="/')
      .replace(/src="\/docs\//g, 'src="/')
      .replace(/href="\.\.\/\.\.\//g, 'href="./')
      .replace(/href="\.\.\//g, 'href="./')
      .replace(/src="\.\.\/\.\.\/public\//g, 'src="./public/')
      .replace(/src="\.\.\/public\//g, 'src="./public/');
  }
  
  // For regular HTML files
  return content
    // Remove any /docs/ references
    .replace(/href="\/docs\//g, `href="${basePath}`)
    .replace(/src="\/docs\//g, `src="${basePath}`)
    
    // CSS paths
    .replace(/href="\.\.\/css\//g, `href="${basePath}css/`)
    .replace(/href="\/css\//g, `href="${basePath}css/`)
    .replace(/href="css\//g, `href="${basePath}css/`)
    
    // JS paths
    .replace(/src="\.\.\/js\//g, `src="${basePath}js/`)
    .replace(/src="\/js\//g, `src="${basePath}js/`)
    .replace(/src="js\//g, `src="${basePath}js/`)
    
    // Image paths
    .replace(/src="\.\.\/public\//g, `src="${basePath}public/`)
    .replace(/src="\/public\//g, `src="${basePath}public/`)
    .replace(/src="public\//g, `src="${basePath}public/`)
    
    // Link paths
    .replace(/href="\.\.\/index\.html/g, `href="${basePath}index.html`)
    .replace(/href="\/index\.html/g, `href="${basePath}index.html`)
    .replace(/href="index\.html/g, `href="${basePath}index.html`)
    
    // Navigation links
    .replace(/href="\.\.\/cart\//g, `href="${basePath}cart/`)
    .replace(/href="\/cart\//g, `href="${basePath}cart/`)
    .replace(/href="cart\//g, `href="${basePath}cart/`)
    
    .replace(/href="\.\.\/checkout\//g, `href="${basePath}checkout/`)
    .replace(/href="\/checkout\//g, `href="${basePath}checkout/`)
    
    .replace(/href="\.\.\/product_listing\//g, `href="${basePath}product_listing/`)
    .replace(/href="\/product_listing\//g, `href="${basePath}product_listing/`)
    
    .replace(/href="\.\.\/product_pages\//g, `href="${basePath}product_pages/`)
    .replace(/href="\/product_pages\//g, `href="${basePath}product_pages/`);
}

async function fixUtilsBasePath() {
  const utilsPath = 'docs/js/utils.mjs';
  if (await fs.pathExists(utilsPath)) {
    const robustBasePath = `// Robust basePath detection for all environments
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // GitHub Pages detection - for your specific repository
  if (hostname === 'oseimacdonald.github.io' && pathname.includes('/Sleep-Outside/')) {
    return '/Sleep-Outside/';
  }
  
  // Local development with different servers
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    // Check if we're running from docs folder (production build)
    if (pathname.includes('/docs/') || pathname.endsWith('/docs')) {
      return './';
    }
    // Development from src folder
    return '../';
  }
  
  // Default: assume we're at root level (GitHub Pages)
  return './';
}

const basePath = getBasePath();
console.log('🔧 Base path detected:', basePath, 'from hostname:', window.location.hostname, 'pathname:', window.location.pathname);`;

    let content = await fs.readFile(utilsPath, 'utf8');
    
    // Replace the entire basePath section
    const basePathRegex = /(\/\/.*basePath.*|const basePath.*|function getBasePath[\s\S]*?const basePath.*?;)/;
    
    if (content.match(basePathRegex)) {
      content = content.replace(basePathRegex, robustBasePath);
    } else {
      // Insert at the top of the file
      content = robustBasePath + '\n\n' + content;
    }
    
    await fs.writeFile(utilsPath, content);
    console.log('✅ Fixed utils.mjs basePath - robust detection for all environments');
  }
}

async function fixCheckoutPageScript() {
  const checkoutHTML = 'docs/checkout/index.html';
  
  if (await fs.pathExists(checkoutHTML)) {
    let content = await fs.readFile(checkoutHTML, 'utf8');
    
    // Ensure main.js is properly referenced
    if (content.includes('main.mjs')) {
      content = content.replace(/src="[^"]*main\.mjs"/g, 'src="../js/main.js"');
    }
    
    // Add main.js if missing
    if (!content.includes('main.js') && !content.includes('main.mjs')) {
      content = content.replace(
        /<\/body>/,
        `  <script type="module" src="../js/main.js"></script>\n</body>`
      );
    }
    
    await fs.writeFile(checkoutHTML, content);
    console.log('✅ Fixed checkout page script reference');
  }
}

buildForProduction().catch(console.error);