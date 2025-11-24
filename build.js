const fs = require('fs-extra');
const path = require('path');

async function buildForProduction() {
  console.log('🚀 Building for production from js--team4 branch...');
  
  // Ensure docs directory exists and is clean
  await fs.emptyDir('docs');
  
  // Copy all src files to docs
  await fs.copy('src', 'docs');
  
  // Update ALL HTML files for production (relative paths for both environments)
  await updateAllHTMLFiles();
  
  // Fix utils.mjs with smart basePath detection
  await fixUtilsBasePath();
  
  // Fix checkout page to load main.js
  await fixCheckoutPageScript();
  
  console.log('✅ Production build complete!');
  console.log('📁 Files are in the docs/ folder');
  console.log('🌐 Works in both local development and GitHub Pages');
}

async function updateAllHTMLFiles() {
  // Find all HTML files in docs folder
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
  
  // Check if this is a partial file (header/footer)
  const isPartial = filePath.includes('partials');
  
  if (isPartial) {
    // For partials, use root-relative paths since they're included in different locations
    console.log(`📄 Updating PARTIAL: ${filePath} -> using root-relative paths`);
    
    content = content
      // Remove any /docs/ references
      .replace(/href="\/docs\//g, 'href="./')
      .replace(/src="\/docs\//g, 'src="./')
      
      // Fix the problematic product_pages/cart and product_pages/checkout patterns
      .replace(/href="[^"]*product_pages\/cart\//g, 'href="./cart/')
      .replace(/href="[^"]*product_pages\/checkout\//g, 'href="./checkout/')
      
      // For partials, always use root-relative paths
      .replace(/href="\.\.\/\.\.\/index\.html/g, 'href="./index.html')
      .replace(/href="\.\.\/index\.html/g, 'href="./index.html')
      .replace(/href="index\.html/g, 'href="./index.html')
      
      .replace(/src="\.\.\/\.\.\/public\//g, 'src="./public/')
      .replace(/src="\.\.\/public\//g, 'src="./public/')
      .replace(/src="public\//g, 'src="./public/')
      
      .replace(/href="\.\.\/\.\.\/cart\//g, 'href="./cart/')
      .replace(/href="\.\.\/cart\//g, 'href="./cart/')
      .replace(/href="cart\//g, 'href="./cart/');
      
  } else {
    // For regular HTML files, use the depth-based relative paths
    const relativePath = path.relative('docs', path.dirname(filePath));
    const depth = relativePath ? relativePath.split(path.sep).length : 0;
    const basePath = depth === 0 ? './' : '../'.repeat(depth);
    
    console.log(`📄 Updating: ${filePath} (depth: ${depth}, basePath: ${basePath})`);
    
    content = content
      // Remove any /docs/ references
      .replace(/href="\/docs\//g, `href="${basePath}`)
      .replace(/src="\/docs\//g, `src="${basePath}`)
      
      // Fix the problematic product_pages/cart and product_pages/checkout patterns
      .replace(/href="[^"]*product_pages\/cart\//g, `href="${basePath}cart/`)
      .replace(/href="[^"]*product_pages\/checkout\//g, `href="${basePath}checkout/`)
      
      // CSS paths
      .replace(/href="\.\.\/css\//g, `href="${basePath}css/`)
      .replace(/href="\/css\//g, `href="${basePath}css/`)
      .replace(/href="css\//g, `href="${basePath}css/`)
      
      // JS paths - IMPORTANT: Fix JavaScript paths for header/footer functionality
      .replace(/src="\.\.\/js\//g, `src="${basePath}js/`)
      .replace(/src="\/js\//g, `src="${basePath}js/`)
      .replace(/src="js\//g, `src="${basePath}js/`)
      .replace(/from "\.\.\/js\//g, `from "${basePath}js/`)
      .replace(/from "\/js\//g, `from "${basePath}js/`)
      .replace(/from "\.\.\/\.\.\/js\//g, `from "${basePath}js/`)
      
      // Image paths
      .replace(/src="\.\.\/public\//g, `src="${basePath}public/`)
      .replace(/src="\/public\//g, `src="${basePath}public/`)
      .replace(/src="public\//g, `src="${basePath}public/`)
      
      // Link paths - fix navigation
      .replace(/href="\.\.\/index\.html/g, `href="${basePath}index.html`)
      .replace(/href="\/index\.html/g, `href="${basePath}index.html`)
      .replace(/href="index\.html/g, `href="${basePath}index.html`)
      
      // Cart links
      .replace(/href="\.\.\/cart\//g, `href="${basePath}cart/`)
      .replace(/href="\/cart\//g, `href="${basePath}cart/`)
      .replace(/href="cart\//g, `href="${basePath}cart/`)
      
      // Checkout links
      .replace(/href="\.\.\/checkout\//g, `href="${basePath}checkout/`)
      .replace(/href="\/checkout\//g, `href="${basePath}checkout/`)
      
      // Product listing links
      .replace(/href="\.\.\/product_listing\//g, `href="${basePath}product_listing/`)
      .replace(/href="\/product_listing\//g, `href="${basePath}product_listing/`)
      
      // Product pages links
      .replace(/href="\.\.\/product_pages\//g, `href="${basePath}product_pages/`)
      .replace(/href="\/product_pages\//g, `href="${basePath}product_pages/`);
  }
  
  await fs.writeFile(filePath, content);
}

async function fixUtilsBasePath() {
  const utilsPath = 'docs/js/utils.mjs';
  if (await fs.pathExists(utilsPath)) {
    let content = await fs.readFile(utilsPath, 'utf8');
    
    // Create a robust basePath that works in ALL environments
    const smartBasePath = `// Smart basePath detection for all environments
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // GitHub Pages detection - exact match for your repository
  if (hostname === 'oseimacdonald.github.io' && pathname.includes('/Sleep-Outside/')) {
    return '/Sleep-Outside/';
  }
  
  // Local development with Live Server (common ports)
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    return './';
  }
  
  // Default fallback - use relative paths
  return './';
}

const basePath = getBasePath();`;
    
    // Check what type of basePath currently exists and replace it
    if (content.includes('const basePath')) {
      // Replace any existing basePath declaration
      if (content.includes('function getBasePath')) {
        // Replace existing dynamic basePath
        content = content.replace(/function getBasePath[\s\S]*?const basePath = getBasePath\(\);/, smartBasePath);
      } else {
        // Replace simple basePath declaration
        content = content.replace(/const basePath = '[^']*';/, smartBasePath);
      }
    } else {
      // Add basePath if it doesn't exist (shouldn't happen, but just in case)
      content = smartBasePath + '\n\n' + content;
    }
    
    await fs.writeFile(utilsPath, content);
    console.log('✅ Fixed utils.mjs basePath - smart detection for all environments');
  }
}

async function fixCheckoutPageScript() {
  console.log('🛒 Fixing checkout page script reference...');
  
  const checkoutHTML = 'docs/checkout/index.html';
  
  if (await fs.pathExists(checkoutHTML)) {
    let content = await fs.readFile(checkoutHTML, 'utf8');
    
    // Check what script is currently referenced
    const hasMainMjs = content.includes('main.mjs');
    const hasMainJs = content.includes('main.js');
    
    console.log(`📄 Checkout page has main.mjs: ${hasMainMjs}`);
    console.log(`📄 Checkout page has main.js: ${hasMainJs}`);
    
    if (hasMainMjs) {
      // Replace main.mjs with main.js
      console.log('📝 Changing main.mjs to main.js in checkout page');
      content = content.replace(/src="[^"]*main\.mjs"/g, 'src="../js/main.js"');
    } else if (!hasMainJs) {
      // Add main.js if it's missing
      console.log('📝 Adding main.js to checkout page');
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