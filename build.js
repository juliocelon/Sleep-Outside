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
  
  // Fix ALL JavaScript files with consistent basePath
  await fixAllJavaScriptFiles();
  
  // Fix checkout page to load main.js
  await fixCheckoutPageScript();
  
  console.log('✅ Production build complete!');
  console.log('📁 Files are in the docs/ folder');
  console.log('🌐 Test locally: npx serve docs/');
  console.log('🚀 Then commit and push to GitHub');
}

async function updateAllHTMLFiles() {
  const htmlFiles = await findFiles('docs', '.html');
  
  for (const file of htmlFiles) {
    await updateHTMLFile(file);
  }
}

async function fixAllJavaScriptFiles() {
  const jsFiles = await findFiles('docs', '.mjs');
  const jsFiles2 = await findFiles('docs', '.js');
  
  for (const file of [...jsFiles, ...jsFiles2]) {
    await fixJavaScriptFile(file);
  }
}

async function findFiles(dir, extension) {
  let results = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory()) {
      results = results.concat(await findFiles(itemPath, extension));
    } else if (item.endsWith(extension)) {
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
    // For partials - use consistent relative paths that work everywhere
    return content
      .replace(/href="\/Sleep-Outside\/src\//g, 'href="../')
      .replace(/src="\/Sleep-Outside\/src\//g, 'src="../')
      .replace(/href="\/docs\//g, 'href="../')
      .replace(/src="\/docs\//g, 'src="../')
      .replace(/href="\.\.\/\.\.\//g, 'href="../')
      .replace(/href="\.\.\//g, 'href="../')
      .replace(/src="\.\.\/\.\.\/public\//g, 'src="../public/')
      .replace(/src="\.\.\/public\//g, 'src="../public/');
  }
  
  // For regular HTML files
  return content
    // Remove any GitHub Pages src references
    .replace(/href="\/Sleep-Outside\/src\//g, `href="${basePath}`)
    .replace(/src="\/Sleep-Outside\/src\//g, `src="${basePath}`)
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

async function fixJavaScriptFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  
  console.log(`🔧 Fixing JavaScript file: ${filePath}`);
  
  // Only fix files that actually have getBasePath function
  if (content.includes('getBasePath')) {
    const universalBasePath = `// UNIVERSAL basePath detection - works in ALL environments
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // GitHub Pages - docs folder is root
  if (hostname === 'oseimacdonald.github.io' && pathname.startsWith('/Sleep-Outside/')) {
    return './';
  }
  
  // Local development from docs folder
  if ((hostname === '127.0.0.1' || hostname === 'localhost') && 
      (pathname.includes('/docs/') || pathname.endsWith('/docs'))) {
    return './';
  }
  
  // Local development from src folder
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    return '../';
  }
  
  // Fallback
  return './';
}`;

    // More precise regex to match getBasePath function without breaking syntax
    const basePathRegex = /function\s+getBasePath\s*\(\s*\)\s*\{[\s\S]*?\n\}/;
    
    if (content.match(basePathRegex)) {
      content = content.replace(basePathRegex, universalBasePath);
      console.log(`✅ Fixed getBasePath() in: ${filePath}`);
    }
  }

  // Fix hardcoded paths more carefully
  content = content.replace(/['"]\/Sleep-Outside\/src\/['"]/g, `'./'`);
  content = content.replace(/['"]\/Sleep-Outside\/['"]/g, `'./'`);
  
  // Fix template paths in utils.mjs specifically
  if (filePath.includes('utils.mjs')) {
    content = content.replace(
      /if \(isGitHubPages\) \{\s*\/\/ Production - GitHub Pages\s*basePath = '\/Sleep-Outside\/src';/g,
      `if (isGitHubPages) {
  // Production - GitHub Pages (docs folder is root)
  basePath = './';`
    );
  }

  await fs.writeFile(filePath, content);
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