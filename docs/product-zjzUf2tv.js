import{s as o,g as a,c}from"./utils-DO69oM1T.js";import{P as s}from"./ProductData-B9ZUbXGv.js";class i{constructor(t,e){this.productId=t,this.product={},this.dataSource=e}async init(){this.product=await this.dataSource.findProductById(this.productId),this.renderProductDetails(),this.updateCartIcon(),document.getElementById("addToCart").addEventListener("click",this.addToCart.bind(this))}addToCart(){let t=JSON.parse(localStorage.getItem("so-cart"))||[];Array.isArray(t)||(t=[t]);const e=t.findIndex(r=>r.Id===this.product.Id);e>-1?t[e].quantity=(t[e].quantity||1)+1:(this.product.quantity=1,t.push(this.product)),o("so-cart",t),this.updateCartIcon()}updateCartIcon(){const t=a(),e=document.querySelector(".cart"),r=e.querySelector(".cart-badge");if(r&&r.remove(),t>0){const d=document.createElement("span");d.className="cart-badge",d.textContent=t,e.appendChild(d)}}renderProductDetails(){document.querySelector("title").textContent=`SleepOutside | ${this.product.Name}`;const t=`
    <section class="product-detail">
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Image}"  <!-- Use the path directly from JSON -->
        alt="${this.product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    </section>
  `;document.querySelector("main").innerHTML=t}}const n=c("product"),u=new s("tents"),p=new i(n,u);p.init();
