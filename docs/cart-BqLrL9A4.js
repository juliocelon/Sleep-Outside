import{a as u,b as m,s as y}from"./utils-DO69oM1T.js";function e(){const t=u("so-cart");if(!t||Array.isArray(t)&&t.length===0){document.querySelector(".product-list").innerHTML=`
      <li class="empty-cart">
        <p>Your cart is empty</p>
        <a href="../">Continue Shopping</a>
      </li>
    `;const n=document.querySelector(".cart-totals");n&&n.remove();return}const a=(Array.isArray(t)?t:[t]).map(n=>f(n));document.querySelector(".product-list").innerHTML=a.join(""),g(),v()}function f(t){const s=t.quantity||1,a=(t.FinalPrice*s).toFixed(2);return`<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${t.Image}"
        alt="${t.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${t.Name}</h2>
    </a>
    <p class="cart-card__color">${t.Colors[0].ColorName}</p>
    <div class="cart-card__quantity">
      <button class="quantity-btn minus" data-id="${t.Id}">-</button>
      <span class="quantity-display">qty: ${s}</span>
      <button class="quantity-btn plus" data-id="${t.Id}">+</button>
    </div>
    <p class="cart-card__price">$${a}</p>
    <button class="remove-btn" data-id="${t.Id}" title="Remove all">×</button>
  </li>`}function h(){const t=u("so-cart")||[],a=(Array.isArray(t)?t:[t]).reduce((d,c)=>{const p=c.quantity||1;return d+c.FinalPrice*p},0),o=a*.08,r=a>0?5.99:0,l=a+o+r;return{subtotal:a.toFixed(2),tax:o.toFixed(2),shipping:r.toFixed(2),grandTotal:l.toFixed(2)}}function v(){const t=h(),s=`
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
  `,a=document.querySelector(".cart-totals");a&&a.remove(),document.querySelector(".product-list").insertAdjacentHTML("afterend",s),b()}function b(){const t=document.querySelector(".checkout-btn");t&&t.addEventListener("click",function(){window.location.href="../checkout/index.html"})}function g(){document.querySelectorAll(".remove-btn").forEach(n=>{n.addEventListener("click",function(){const o=this.getAttribute("data-id");m(o),e()})}),document.querySelectorAll(".quantity-btn.minus").forEach(n=>{n.addEventListener("click",function(){const o=this.getAttribute("data-id");i(o,-1)})}),document.querySelectorAll(".quantity-btn.plus").forEach(n=>{n.addEventListener("click",function(){const o=this.getAttribute("data-id");i(o,1)})})}function i(t,s){let a=JSON.parse(localStorage.getItem("so-cart"))||[];Array.isArray(a)||(a=[a]);const n=a.findIndex(o=>o.Id===t);n>-1&&(a[n].quantity=(a[n].quantity||1)+s,a[n].quantity<=0&&a.splice(n,1),y("so-cart",a),e())}e();
