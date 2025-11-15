import{l as r,g as i}from"./utils-CaVCbCby.js";function s(){return window.location.hostname.includes("github.io")?"/Sleep-Outside/":"./"}function l(){document.body.insertAdjacentHTML("afterbegin",`
    <div class="custom-alert" id="siteAlert">
      <div class="alert-content">
        <span class="alert-message">🚨 Special Offer: Free shipping on orders over $50!</span>
        <button class="alert-close" id="closeAlert">×</button>
      </div>
    </div>
  `),document.getElementById("closeAlert").addEventListener("click",function(){document.getElementById("siteAlert").style.display="none"}),setTimeout(()=>{const t=document.getElementById("siteAlert");t&&(t.style.display="none")},5e3)}function d(){const e=i(),t=document.querySelector(".cart"),a=t.querySelector(".cart-badge");if(a&&a.remove(),e>0){const c=document.createElement("span");c.className="cart-badge",c.textContent=e,t.appendChild(c)}}function u(){const e=s();document.querySelectorAll('a[href="../index.html"], a[href="/src/index.html"], a[href="/"]').forEach(n=>{n.href=e}),document.querySelectorAll('a[href="../cart/index.html"], a[href="/cart/index.html"]').forEach(n=>{n.href=`${e}cart/`}),document.querySelectorAll('a[href*="product_pages"]').forEach(n=>{const o=n.href.split("product=")[1];o&&(n.href=`${e}product_pages/?product=${o}`)})}function g(){const e=s(),t=`
    <section class="categories">
      <h2>Shop by Category</h2>
      <div class="category-grid">
        <a href="${e}product_listing/?category=tents" class="category-card">
          <img src="${e}public/images/noun_Tent_2517.svg" alt="Tents">
          <h3>Tents</h3>
        </a>
        <a href="${e}product_listing/?category=backpacks" class="category-card">
          <img src="${e}public/images/noun_Backpack_65884.svg" alt="Backpacks">
          <h3>Backpacks</h3>
        </a>
        <a href="${e}product_listing/?category=sleeping-bags" class="category-card">
          <img src="${e}public/images/noun_Backpack_2389275.svg" alt="Sleeping Bags">
          <h3>Sleeping Bags</h3>
        </a>
        <a href="${e}product_listing/?category=hammocks" class="category-card">
          <img src="${e}public/images/noun_Tent_2517.svg" alt="Hammocks">
          <h3>Hammocks</h3>
        </a>
      </div>
    </section>
  `,a=document.querySelector(".products");a&&a.remove();const c=document.querySelector(".hero");c&&c.insertAdjacentHTML("afterend",t)}document.addEventListener("DOMContentLoaded",async function(){await r(),l(),g(),u(),d()});
