import{s,g as n,c as i}from"./utils-DO69oM1T.js";import{P as c}from"./ProductData-qEP58zgO.js";function d(a){const t=window.location.href.includes("/Sleep-Outside/"),e=window.location.hostname.includes("github.io");if(!t&&!e)return a;{const r={"marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg":"marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320-CwrOuOqG.jpg","the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg":"the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320-B_cTxQf6.jpg","the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320.jpg":"the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320-CJsXUy8z.jpg","cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320.jpg":"cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320-BUtqhik6.jpg"},o=a.split("/").pop();return`/Sleep-Outside/assets/${r[o]||o}`}}class p{constructor(t,e){this.productId=t,this.product={},this.dataSource=e}async init(){this.product=await this.dataSource.findProductById(this.productId),this.renderProductDetails(),this.updateCartIcon(),document.getElementById("addToCart").addEventListener("click",this.addToCart.bind(this))}addToCart(){let t=JSON.parse(localStorage.getItem("so-cart"))||[];Array.isArray(t)||(t=[t]);const e=t.findIndex(r=>r.Id===this.product.Id);e>-1?t[e].quantity=(t[e].quantity||1)+1:(this.product.quantity=1,t.push(this.product)),s("so-cart",t),this.updateCartIcon()}updateCartIcon(){const t=n(),e=document.querySelector(".cart"),r=e.querySelector(".cart-badge");if(r&&r.remove(),t>0){const o=document.createElement("span");o.className="cart-badge",o.textContent=t,e.appendChild(o)}}renderProductDetails(){const t=d(this.product.Image);document.querySelector("title").textContent=`SleepOutside | ${this.product.Name}`;const e=`
      <section class="product-detail">
        <h3>${this.product.Brand.Name}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        <img
          class="divider"
          src="${t}"
          alt="${this.product.NameWithoutBrand}"
        />
        <p class="product-card__price">$${this.product.FinalPrice}</p>
        <p class="product__color">${this.product.Colors[0].ColorName}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;document.querySelector("main").innerHTML=e}}const u=i("product"),l=new c("tents"),h=new p(u,l);h.init();
