import{l as m,a as l,r as g,s as y}from"./utils-MX4Wut5O.js";m();function s(){const t=l("so-cart");if(console.log("🛒 Cart items from localStorage:",t),!t||Array.isArray(t)&&t.length===0){document.querySelector(".product-list").innerHTML=`
      <li class="empty-cart">
        <p>Your cart is empty</p>
        <a href="../">Continue Shopping</a>
      </li>
    `;const n=document.querySelector(".cart-totals");n&&n.remove();return}const o=Array.isArray(t)?t:[t];o.length>0&&console.log("🖼️ First cart item image data:",{Image:o[0].Image,Images:o[0].Images,Name:o[0].Name});const a=o.map(n=>h(n));document.querySelector(".product-list").innerHTML=a.join(""),I(),v()}function h(t){const o=t.quantity||1,a=(t.FinalPrice*o).toFixed(2);return`<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${t.Images?.PrimaryMedium||t.Images?.PrimaryLarge||t.Images?.PrimarySmall||t.Image||"/images/placeholder.jpg"}"
        alt="${t.Name}"
        onerror="this.src='/public/images/noun_Tent_2517.svg'"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${t.Name}</h2>
    </a>
    <p class="cart-card__color">${t.Colors?t.Colors[0].ColorName:"N/A"}</p>
    <div class="cart-card__quantity">
      <button class="quantity-btn minus" data-id="${t.Id}">-</button>
      <span class="quantity-display">qty: ${o}</span>
      <button class="quantity-btn plus" data-id="${t.Id}">+</button>
    </div>
    <p class="cart-card__price">$${a}</p>
    <button class="remove-btn" data-id="${t.Id}" title="Remove all">×</button>
  </li>`}function f(){const t=l("so-cart")||[],a=(Array.isArray(t)?t:[t]).reduce((d,c)=>{const p=c.quantity||1;return d+c.FinalPrice*p},0),e=a*.08,r=a>0?5.99:0,u=a+e+r;return{subtotal:a.toFixed(2),tax:e.toFixed(2),shipping:r.toFixed(2),grandTotal:u.toFixed(2)}}function v(){const t=f(),o=`
    <div class="cart-totals divider">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>$${t.subtotal}</span>
      </div>
      <div class="total-row">
        <span>Tax:</span>
        <span>$${t.tax}</span>
      </div>
      <div class="total-row">
        <span>Shipping:</span>
        <span>$${t.shipping}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total:</span>
        <span>$${t.grandTotal}</span>
      </div>
      <button class="checkout-btn">Proceed to Checkout</button>
    </div>
  `,a=document.querySelector(".cart-totals");a&&a.remove(),document.querySelector(".product-list").insertAdjacentHTML("afterend",o),b()}function b(){const t=document.querySelector(".checkout-btn");t&&t.addEventListener("click",function(){window.location.href="../checkout/index.html"})}function I(){document.querySelectorAll(".remove-btn").forEach(n=>{n.addEventListener("click",function(){const e=this.getAttribute("data-id");g(e),s()})}),document.querySelectorAll(".quantity-btn.minus").forEach(n=>{n.addEventListener("click",function(){const e=this.getAttribute("data-id");i(e,-1)})}),document.querySelectorAll(".quantity-btn.plus").forEach(n=>{n.addEventListener("click",function(){const e=this.getAttribute("data-id");i(e,1)})})}function i(t,o){let a=JSON.parse(localStorage.getItem("so-cart"))||[];Array.isArray(a)||(a=[a]);const n=a.findIndex(e=>e.Id===t);n>-1&&(a[n].quantity=(a[n].quantity||1)+o,a[n].quantity<=0&&a.splice(n,1),y("so-cart",a),s())}s();
