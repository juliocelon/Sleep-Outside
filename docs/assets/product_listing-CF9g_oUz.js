import{c as i,l as c,b as n}from"./utils-CaVCbCby.js";import{P as d}from"./ProductData-ECdtHqjy.js";function l(){return console.log("🔄 getBasePath() called"),console.log("📍 Current pathname:",window.location.pathname),console.log("📍 Hostname:",window.location.hostname),window.location.hostname.includes("github.io")?(console.log("🌐 GitHub Pages detected, returning:","/Sleep-Outside/"),"/Sleep-Outside/"):window.location.pathname.includes("/product_listing/")?(console.log("📁 Product listing page detected, returning:","../"),"../"):(console.log("🏠 Default case, returning:","./"),"./")}class u{constructor(o,e,t){this.category=o,this.dataSource=e,this.listElement=t,this.products=[],this.filteredProducts=[]}async init(){this.products=await this.dataSource.getData(),this.filteredProducts=[...this.products],this.renderList(this.filteredProducts),this.addSearchAndSort()}addSearchAndSort(){this.listElement.insertAdjacentHTML("beforebegin",`
      <div class="product-controls">
        <div class="search-box">
          <input type="text" id="productSearch" placeholder="Search products..." />
        </div>
        <div class="sort-box">
          <select id="productSort">
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="brand">Sort by Brand</option>
          </select>
        </div>
      </div>
    `),document.getElementById("productSearch").addEventListener("input",e=>{this.searchProducts(e.target.value)}),document.getElementById("productSort").addEventListener("change",e=>{this.sortProducts(e.target.value)})}searchProducts(o){const e=o.toLowerCase();this.filteredProducts=this.products.filter(t=>t.Name.toLowerCase().includes(e)||t.Brand.Name.toLowerCase().includes(e)||t.NameWithoutBrand.toLowerCase().includes(e)),this.renderList(this.filteredProducts)}sortProducts(o){switch(o){case"name":this.filteredProducts.sort((e,t)=>e.Name.localeCompare(t.Name));break;case"price-low":this.filteredProducts.sort((e,t)=>e.FinalPrice-t.FinalPrice);break;case"price-high":this.filteredProducts.sort((e,t)=>t.FinalPrice-e.FinalPrice);break;case"brand":this.filteredProducts.sort((e,t)=>e.Brand.Name.localeCompare(t.Brand.Name));break}this.renderList(this.filteredProducts)}renderList(o){i(h,this.listElement,o,"afterbegin",!0)}}function h(r){const o=l();console.log("🛒 Product card generated for:",r.NameWithoutBrand),console.log("🔗 Base path used:",o),console.log("🔗 Full product URL:",`${o}product_pages/?product=${r.Id}`);const e=r.Images?.PrimaryMedium||r.Images?.PrimaryLarge||r.Images?.PrimarySmall||"/images/placeholder.jpg",t=r.SuggestedRetailPrice>r.FinalPrice,a=t?Math.round((r.SuggestedRetailPrice-r.FinalPrice)/r.SuggestedRetailPrice*100):0;return`
    <li class="product-card">
      <a href="${o}product_pages/?product=${r.Id}">
        <img
          src="${e}"
          alt="${r.NameWithoutBrand}"
          onerror="this.src='${o}public/images/noun_Tent_2517.svg'"
        />
        <h3 class="card__brand">${r.Brand.Name}</h3>
        <h2 class="card__name">${r.NameWithoutBrand}</h2>
        ${t?`<div class="discount-badge">Save ${a}%</div>`:""}
        <div class="price-container">
          ${t?`<span class="original-price">$${r.SuggestedRetailPrice.toFixed(2)}</span>`:""}
          <p class="product-card__price">$${r.FinalPrice}</p>
        </div>
      </a>
    </li>
  `}c();const s=n("category")||"tents";document.addEventListener("DOMContentLoaded",async function(){const r=document.getElementById("page-title");r&&(r.textContent=`Top Products: ${s.charAt(0).toUpperCase()+s.slice(1)}`);const o=document.querySelector(".product-list");if(o)try{const e=new d(s),t=new u(s,e,o),a=await e.getData();t.products=a,t.filteredProducts=[...a],t.renderList(a),t.addSearchAndSort()}catch(e){console.error("Error loading products:",e)}});
