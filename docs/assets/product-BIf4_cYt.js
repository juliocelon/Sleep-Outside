import{s as i,g as o,l as c,b as s}from"./utils-x_2z0UIf.js";import{P as d}from"./ProductData-ECdtHqjy.js";function n(){return window.location.hostname.includes("github.io")?"/Sleep-Outside/":"../"}class u{constructor(t,e){this.productId=t,this.product={},this.dataSource=e}async init(){this.product=await this.dataSource.findProductById(this.productId),this.renderProductDetails(),await this.waitForCartElement(),this.updateCartIcon(),document.getElementById("addToCart").addEventListener("click",this.addToCart.bind(this))}waitForCartElement(){return new Promise(t=>{const e=()=>{document.querySelector(".cart")?t():setTimeout(e,100)};e()})}addToCart(){let t=JSON.parse(localStorage.getItem("so-cart"))||[];Array.isArray(t)||(t=[t]);const e=t.findIndex(r=>r.Id===this.product.Id);e>-1?t[e].quantity=(t[e].quantity||1)+1:(this.product.quantity=1,t.push(this.product)),i("so-cart",t),this.updateCartIcon()}updateCartIcon(){const t=o(),e=document.querySelector(".cart");if(!e)return;const r=e.querySelector(".cart-badge");if(r&&r.remove(),t>0){const a=document.createElement("span");a.className="cart-badge",a.textContent=t,e.style.position="relative",e.appendChild(a)}}addBreadcrumbs(){const t=window.location.hostname.includes("github.io")?"/Sleep-Outside/":"../",e=`
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="${t}">Home</a></li>
          <li><a href="${t}product_pages/">Products</a></li>
          <li><span>${this.product.NameWithoutBrand}</span></li>
        </ol>
      </nav>
    `;document.querySelector("main").insertAdjacentHTML("afterbegin",e)}renderProductDetails(){const t=this.product.Images?.PrimaryLarge||this.product.Images?.PrimaryMedium||this.product.Images?.PrimaryExtraLarge||"/images/placeholder.jpg",e=this.product.SuggestedRetailPrice>this.product.FinalPrice,r=e?Math.round((this.product.SuggestedRetailPrice-this.product.FinalPrice)/this.product.SuggestedRetailPrice*100):0;document.querySelector("title").textContent=`SleepOutside | ${this.product.Name}`,document.querySelector("main").innerHTML="",this.addBreadcrumbs();const a=`
      <section class="product-detail">
        <h3>${this.product.Brand.Name}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        ${e?`<div class="discount-flag">Save ${r}%</div>`:""}
        <img
          class="divider"
          src="${t}"
          alt="${this.product.NameWithoutBrand}"
          onerror="this.src='${n()}public/images/noun_Tent_2517.svg'"
        />
        <div class="price-container">
          ${e?`<p class="original-price">$${this.product.SuggestedRetailPrice.toFixed(2)}</p>`:""}
          <p class="product-card__price">$${this.product.FinalPrice}</p>
        </div>
        <p class="product__color">${this.product.Colors?this.product.Colors[0].ColorName:"N/A"}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple||this.product.DescriptionHtml||"No description available"}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;document.querySelector("main").insertAdjacentHTML("beforeend",a)}}c();const l=s("product"),p=new d("tents"),h=new u(l,p);h.init();
