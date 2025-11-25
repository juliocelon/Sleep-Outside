const fs = require('fs-extra');
const path = require('path');

async function buildForProduction() {
  console.log('🚀 Building for production...');
  
  // Ensure docs directory exists and is clean
  await fs.emptyDir('docs');
  
  // Copy all src files to docs
  await fs.copy('src', 'docs');
  
  // Update ALL HTML files for production - WITH BETTER PATH FIXING
  await updateAllHTMLFiles();
  
  // Fix ALL JavaScript files with consistent basePath
  await fixAllJavaScriptFiles();
  
  // Fix utils.mjs header/footer template loading specifically
  await fixUtilsTemplatePaths();
  
  // Fix product links in ProductList.mjs specifically
  await fixProductLinks();
  
  // Fix ProductDetails.mjs specifically - WITH CSS PATH FIX
  await fixProductDetails();
  
  // Fix product_pages/index.html specifically - CRITICAL FIX
  await fixProductPagesHTML();
  
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
  
  // For regular HTML files - MORE COMPREHENSIVE FIX
  return content
    // Remove any GitHub Pages src references - MORE COMPREHENSIVE
    .replace(/href="\/Sleep-Outside\/src\//g, `href="${basePath}`)
    .replace(/src="\/Sleep-Outside\/src\//g, `src="${basePath}`)
    .replace(/href="\/docs\//g, `href="${basePath}`)
    .replace(/src="\/docs\//g, `src="${basePath}`)
    .replace(/href="\/src\//g, `href="${basePath}`)
    .replace(/src="\/src\//g, `src="${basePath}`)
    
    // CSS paths - FIX SPECIFICALLY FOR ABSOLUTE PATHS
    .replace(/href="\/css\//g, `href="${basePath}css/`)
    .replace(/href="\.\.\/css\//g, `href="${basePath}css/`)
    .replace(/href="css\//g, `href="${basePath}css/`)
    .replace(/href="src\/css\//g, `href="${basePath}css/`)
    .replace(/href="\/Sleep-Outside\/css\//g, `href="${basePath}css/`)
    
    // JS paths
    .replace(/src="\.\.\/js\//g, `src="${basePath}js/`)
    .replace(/src="\/js\//g, `src="${basePath}js/`)
    .replace(/src="js\//g, `src="${basePath}js/`)
    .replace(/src="src\/js\//g, `src="${basePath}js/`)
    .replace(/src="\/Sleep-Outside\/js\//g, `src="${basePath}js/`)
    
    // Image paths
    .replace(/src="\.\.\/public\//g, `src="${basePath}public/`)
    .replace(/src="\/public\//g, `src="${basePath}public/`)
    .replace(/src="public\//g, `src="${basePath}public/`)
    .replace(/src="src\/public\//g, `src="${basePath}public/`)
    .replace(/src="\/Sleep-Outside\/public\//g, `src="${basePath}public/`)
    
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
  
  console.log('🔧 Debug - hostname:', hostname, 'pathname:', pathname);
  
  // GitHub Pages detection - EXACT match for your repository
  if (hostname === 'oseimacdonald.github.io' && pathname.startsWith('/Sleep-Outside/')) {
    console.log('🔧 Detected GitHub Pages - using relative paths');
    // On GitHub Pages, when in subfolders, we need to go up to root
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from docs folder
  if ((hostname === '127.0.0.1' || hostname === 'localhost') && 
      (pathname.includes('/docs/') || pathname.endsWith('/docs'))) {
    console.log('🔧 Detected local docs folder - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from src folder
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    console.log('🔧 Detected local development - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return '../';
  }
  
  // Fallback - handle subdirectories properly
  console.log('🔧 Using fallback base path detection');
  if (pathname.includes('/product_listing/') || pathname.includes('/cart/') || pathname.includes('/checkout/') || pathname.includes('/product_pages/')) {
    return '../';
  }
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
  
  await fs.writeFile(filePath, content);
}

async function fixUtilsTemplatePaths() {
  const utilsPath = 'docs/js/utils.mjs';
  
  if (await fs.pathExists(utilsPath)) {
    let content = await fs.readFile(utilsPath, 'utf8');
    
    console.log('🔧 Fixing template paths in utils.mjs');
    
    // Replace the entire loadHeaderFooter function with a corrected version
    const correctedLoadHeaderFooter = `// UNIVERSAL PATH SOLUTION - WORKS FOR BOTH LOCAL AND PRODUCTION
export async function loadHeaderFooter() {
  try {
    const currentPath = window.location.pathname;
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // Determine correct base path
    let basePath = '';
    
    if (isGitHubPages) {
      // Production - GitHub Pages
      if (currentPath.includes('/product_listing/') || currentPath.includes('/cart/') || currentPath.includes('/checkout/') || currentPath.includes('/product_pages/')) {
        basePath = '../';
      } else {
        basePath = './';
      }
    } else {
      // Local development - use relative paths
      if (currentPath.includes('/product_listing/') || currentPath.includes('/cart/') || currentPath.includes('/checkout/') || currentPath.includes('/product_pages/')) {
        basePath = '../';
      } else {
        basePath = './';
      }
    }
    
    console.log('Loading templates with basePath:', basePath);
    
    // Load header
    const headerPath = \`\${basePath}public/partials/header.html\`;
    const headerTemplate = await loadTemplate(headerPath);
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
      await renderWithTemplate(headerTemplate, headerElement);
      // Fix any paths in the loaded header
      fixHeaderPaths(basePath);
    }
    
    // Load footer
    const footerPath = \`\${basePath}public/partials/footer.html\`;
    const footerTemplate = await loadTemplate(footerPath);
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
      await renderWithTemplate(footerTemplate, footerElement);
    }
    
  } catch (error) {
    console.error('Error loading header/footer:', error);
    // Create reliable fallback that works everywhere
    createUniversalFallback();
  }
}`;

    // Replace the loadHeaderFooter function
    const loadHeaderFooterRegex = /export async function loadHeaderFooter\(\)[\s\S]*?^\}/m;
    if (content.match(loadHeaderFooterRegex)) {
      content = content.replace(loadHeaderFooterRegex, correctedLoadHeaderFooter);
      console.log('✅ Fixed loadHeaderFooter function in utils.mjs');
    }

    await fs.writeFile(utilsPath, content);
    console.log('✅ Fixed template paths in utils.mjs');
  }
}

async function fixProductLinks() {
  const productListPath = 'docs/js/ProductList.mjs';
  
  if (await fs.pathExists(productListPath)) {
    let content = await fs.readFile(productListPath, 'utf8');
    
    console.log('🔧 Fixing product links in ProductList.mjs');
    
    // Replace the entire getBasePath function with the corrected version
    const correctedGetBasePath = `// UNIVERSAL basePath detection - works in ALL environments
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('🔧 Debug - hostname:', hostname, 'pathname:', pathname);
  
  // GitHub Pages detection - EXACT match for your repository
  if (hostname === 'oseimacdonald.github.io' && pathname.startsWith('/Sleep-Outside/')) {
    console.log('🔧 Detected GitHub Pages - using relative paths');
    // On GitHub Pages, when in subfolders, we need to go up to root
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from docs folder
  if ((hostname === '127.0.0.1' || hostname === 'localhost') && 
      (pathname.includes('/docs/') || pathname.endsWith('/docs'))) {
    console.log('🔧 Detected local docs folder - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from src folder
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    console.log('🔧 Detected local development - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return '../';
  }
  
  // Fallback - handle subdirectories properly
  console.log('🔧 Using fallback base path detection');
  if (pathname.includes('/product_listing/') || pathname.includes('/cart/') || pathname.includes('/checkout/') || pathname.includes('/product_pages/')) {
    return '../';
  }
  return './';
}`;

    // Replace getBasePath function
    const basePathRegex = /function\s+getBasePath\s*\(\s*\)\s*\{[\s\S]*?\n\}/;
    if (content.match(basePathRegex)) {
      content = content.replace(basePathRegex, correctedGetBasePath);
      console.log('✅ Replaced getBasePath function');
    }

    await fs.writeFile(productListPath, content);
    console.log('✅ Fixed product links in ProductList.mjs');
  } else {
    console.log('❌ ProductList.mjs not found at:', productListPath);
  }
}

async function fixProductDetails() {
  const productDetailsPath = 'docs/js/ProductDetails.mjs';
  
  if (await fs.pathExists(productDetailsPath)) {
    let content = await fs.readFile(productDetailsPath, 'utf8');
    
    console.log('🔧 Fixing ProductDetails.mjs');
    
    // Replace the entire getBasePath function with the corrected version
    const correctedGetBasePath = `// UNIVERSAL basePath detection - works in ALL environments
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('🔧 Debug - hostname:', hostname, 'pathname:', pathname);
  
  // GitHub Pages detection - EXACT match for your repository
  if (hostname === 'oseimacdonald.github.io' && pathname.startsWith('/Sleep-Outside/')) {
    console.log('🔧 Detected GitHub Pages - using relative paths');
    // On GitHub Pages, when in subfolders, we need to go up to root
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from docs folder
  if ((hostname === '127.0.0.1' || hostname === 'localhost') && 
      (pathname.includes('/docs/') || pathname.endsWith('/docs'))) {
    console.log('🔧 Detected local docs folder - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return './';
  }
  
  // Local development from src folder
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    console.log('🔧 Detected local development - using relative paths');
    if (pathname.includes('/product_listing/') || pathname.includes('/product_pages/') || pathname.includes('/cart/') || pathname.includes('/checkout/')) {
      return '../';
    }
    return '../';
  }
  
  // Fallback - handle subdirectories properly
  console.log('🔧 Using fallback base path detection');
  if (pathname.includes('/product_listing/') || pathname.includes('/cart/') || pathname.includes('/checkout/') || pathname.includes('/product_pages/')) {
    return '../';
  }
  return './';
}`;

    // Replace getBasePath function
    const basePathRegex = /function\s+getBasePath\s*\(\s*\)\s*\{[\s\S]*?\n\}/;
    if (content.match(basePathRegex)) {
      content = content.replace(basePathRegex, correctedGetBasePath);
      console.log('✅ Replaced getBasePath function in ProductDetails.mjs');
    }

    // FIX THE CSS PATH - remove the extra slash
    content = content.replace(
      /link\.href = `\$\{basePath\}\/css\/style\.css`;/g,
      'link.href = `${basePath}css/style.css`;'
    );

    await fs.writeFile(productDetailsPath, content);
    console.log('✅ Fixed ProductDetails.mjs - removed extra slash from CSS path');
  } else {
    console.log('❌ ProductDetails.mjs not found at:', productDetailsPath);
  }
}

async function fixProductPagesHTML() {
  const productPagesHTML = 'docs/product_pages/index.html';
  
  if (await fs.pathExists(productPagesHTML)) {
    let content = await fs.readFile(productPagesHTML, 'utf8');
    
    console.log('🔧 Fixing product_pages/index.html inline script');
    
    // SIMPLIFIED APPROACH - Use hardcoded paths that work for production
    const correctedScript = `
    <script type="module">
      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '../css/style.css';
      document.head.appendChild(link);
      
      // Import your existing product module directly
      import('../js/product.js');
    </script>`;

    // Replace the entire script section
    content = content.replace(
      /<script type="module">[\s\S]*?<\/script>/,
      correctedScript
    );

    await fs.writeFile(productPagesHTML, content);
    console.log('✅ Fixed product_pages/index.html inline script - SIMPLIFIED HARDCODED PATHS');
  } else {
    console.log('❌ product_pages/index.html not found at:', productPagesHTML);
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