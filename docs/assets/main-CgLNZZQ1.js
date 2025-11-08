import{r as o,g as i}from"./utils-DO69oM1T.js";import{P as d}from"./ProductData-B9ZUbXGv.js";function u(){return window.location.hostname.includes("github.io")?"/Sleep-Outside/":"./"}class l{constructor(e,a,c){this.category=e,this.dataSource=a,this.listElement=c,this.products=[]}async init(){this.products=await this.dataSource.getData(),this.renderList(this.products)}renderList(e){o(h,this.listElement,e,"afterbegin",!0)}}function h(t){return`
    <li class="product-card">
      <a href="${u()}product_pages/?product=${t.Id}">
        <img
          src="${t.Image}"
          alt="${t.NameWithoutBrand}"
        />
        <h3 class="card__brand">${t.Brand.Name}</h3>
        <h2 class="card__name">${t.NameWithoutBrand}</h2>
        <p class="product-card__price">$${t.FinalPrice}</p>
      </a>
    </li>
  `}const m=["880RR","985RF","985PR","344YJ"];function f(){return window.location.hostname.includes("github.io")?"/Sleep-Outside/":"./"}function p(){const t=i(),e=document.querySelector(".cart"),a=e.querySelector(".cart-badge");if(a&&a.remove(),t>0){const c=document.createElement("span");c.className="cart-badge",c.textContent=t,e.appendChild(c)}}function s(){const t=f();document.querySelectorAll('a[href="../index.html"], a[href="/src/index.html"], a[href="/"]').forEach(r=>{r.href=t}),document.querySelectorAll('a[href="../cart/index.html"], a[href="/cart/index.html"]').forEach(r=>{r.href=`${t}cart/`}),document.querySelectorAll('a[href*="product_pages"]').forEach(r=>{const n=r.href.split("product=")[1];n&&(r.href=`${t}product_pages/?product=${n}`)})}document.addEventListener("DOMContentLoaded",async function(){const t=document.querySelector(".product-list");if(t)try{const e=new d("tents"),a=new l("tents",e,t),r=(await e.getData()).filter(n=>m.includes(n.Id));a.renderList(r),setTimeout(s,100)}catch{}s(),p()});
