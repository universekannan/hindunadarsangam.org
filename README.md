# Hindu Nadar Sangam website

Open `http://localhost/hindunadarsangam.org/` with Apache running in XAMPP.

## Pages

- `index.html` — homepage and five-image slideshow
- `about.html` — About Us
- `history.html` — eight original Tamil history sections
- `office-bearers.html` — archived office bearers
- `committee.html` — archived executive committee
- `gallery.html` — category filters and accessible photograph dialog
- `events.html` — opening ceremony invitation
- `contact.html` — address, phone, map, and enquiry form

Original PHP page URLs have local compatibility entry points. All pages share the original `css/style.css` and `css/responsive.css`, the functional layout in `css/site.css`, the source-design restoration in `css/original-design.css`, and `js/page.js`. The original Poppins and Raleway font imports use Google Fonts. Images and background assets are local.

## Contact delivery

`contact-submit.php` requires PHP 8.1+ and a functioning PHP `mail()` transport. Configure the hosting server's SMTP/sendmail settings before accepting enquiries. The recipient is the email published on the archived contact page: `kmhns2015@gmail.com`. Change it if the office now uses another address. When mail transport is unavailable the form reports the failure and offers direct contact details; it never displays false success. Submitted personal data is not written into public files.

## Content and maintenance

Names, roles, address and historical text come from the 2019 archive and should be checked by the Sangam before publication. Leadership pages label the records as archived.

The 29 original gallery image URLs returned archive error pages. The working gallery therefore displays the five recovered homepage photographs and the academy invitation, grouped by content. Original page sources remain in `source/` for future restoration. Browser preview failed to connect in this environment; automated checks cover links, image validity and slideshow logic, not rendered visual appearance.

Run `node verify-site.cjs` for local asset and slideshow logic checks, `node --check js/page.js` for JavaScript syntax, and `php -l contact-submit.php` for PHP syntax.

`build-site.cjs` regenerates the eight HTML pages and PHP aliases from archived HTML in `source/` and `archive.html`. Run `node build-site.cjs` after editing its shared template or page content. CSS and JavaScript are independent of regeneration. The original archive HTML and legacy styles are retained for reference.

Slideshow: five-second autoplay, previous/next, slide dots, pause/play, arrow keys and horizontal touch swipes. Autoplay pauses when explicitly paused or the tab is hidden, and starts paused for reduced-motion preferences. The first image is visible without JavaScript.

## Original visual design

The homepage reuses its archived content markup. The shared template restores the source background pattern at its original size and repeat settings, the red logo header, blue navigation with teal border, original content widths, gray history panels, typography, spacing, and simple credit footer. The horizontal slideshow and new page functionality are retained. All four background image files referenced by the original stylesheet have been recovered and validated. Backgrounds belonging to unused source components remain available without applying them to unrelated sections. Exact pixel matching has not been confirmed in a rendered browser.
