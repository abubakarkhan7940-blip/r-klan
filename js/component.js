


class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    // Replace this with your actual footer HTML
    this.innerHTML = `
      <footer id="r-klan">
        <div class="contener">
            <div class="content">
                <div class="content-1">
                    <div class="image">
                        <figure>
                            <a href="index.html"><img src="Image/home/R-klan.png" alt="R-klan" class="img"></a>
                        </figure>

                        <figure>
                            <div class="image-1">
                                <a href="https://www.facebook.com" target="_blank"> <img src="Image/home/F.png" alt="face-book" class="you"></a>
                                <a href="https://www.instagram.com" target="_blank"><img src="Image/home/Insta.png" alt="Insta" class="you"></a>
                                <a href="https://in.linkedin.com" target="_blank"><img src="Image/home/in.png" alt="in" class="you"></a>
                            </div>
                        </figure>

                    </div>
                    <div class="text">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="about.html">About Our Cause</a></li>
                            <li><a href="review.html">Reviews</a></li>
                            <li><a href="contact.html">Contact Us</a></li>
                        </ul>
                    </div>
                    <div class="text cell">
                        <p>
                            Address will come here,<br>
                            Address will come here
                        </p>
                        <p><b>(123) 456-7890</b></p>
                        <p>info@r-klan.com</p>
                    </div>
                </div>
                <div class="content-2">
                    <p>© 2026 R-Klan. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </footer>
    `;
  }
}

// Define the custom tags
customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);