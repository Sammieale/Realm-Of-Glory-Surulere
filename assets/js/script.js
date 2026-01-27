window.addEventListener("DOMContentLoaded", function () {
	const header = document.querySelector("header");
	const logo = document.getElementById('logo');

	// If a logo exists, read its source and allow pages to override the scrolled-src
	const originalSrc = logo ? logo.getAttribute('src') : null;
	// Prefer a data attribute on the <img> (data-scrolled-src) so each page can set its own path;
	// fallback to a sensible default relative to index.html
	const scrolledSrc = logo && logo.dataset && logo.dataset.scrolledSrc ? logo.dataset.scrolledSrc : './assets/images/ROGHome_LOGO.png';
	const threshold = 50;

	function updateOnScroll() {
		const scrolled = window.scrollY > threshold;
		if (header) header.classList.toggle('sticky', scrolled);
		if (logo && originalSrc) logo.setAttribute('src', scrolled ? scrolledSrc : originalSrc);
	}

	window.addEventListener('scroll', updateOnScroll, { passive: true });
	updateOnScroll();

	// set footer year if present
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	// Service timer: countdown to next Sunday at 10:00
	(function(){
		const serviceEl = document.getElementById('service-timer');
		if (!serviceEl) return;

		const daysEl = serviceEl.querySelector('.count.days');
		const hoursEl = serviceEl.querySelector('.count.hours');
		const minsEl = serviceEl.querySelector('.count.minutes');
		const secsEl = serviceEl.querySelector('.count.seconds');
		const noteEl = serviceEl.querySelector('.service-note');

		function getNextSunday10(now){
			const target = new Date(now);
			const day = now.getDay(); // 0 = Sunday
			if (day === 0){
				// today is Sunday
				const todayAt10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10,0,0,0);
				if (now < todayAt10) {
					target.setTime(todayAt10.getTime());
					return target;
				}
				// if already past 10am today, go to next Sunday
				target.setDate(now.getDate() + 7);
			} else {
				// days until next Sunday
				const daysUntil = 7 - day;
				target.setDate(now.getDate() + daysUntil);
			}
			target.setHours(10,0,0,0);
			return target;
		}

		let target = getNextSunday10(new Date());

		function pad(n){ return n.toString().padStart(2,'0'); }

		function updateCountdown(){
			const now = new Date();
			if (now > target) target = getNextSunday10(now);
			let diff = Math.max(0, target - now);
			const days = Math.floor(diff / (1000*60*60*24));
			diff -= days * (1000*60*60*24);
			const hours = Math.floor(diff / (1000*60*60));
			diff -= hours * (1000*60*60);
			const minutes = Math.floor(diff / (1000*60));
			diff -= minutes * (1000*60);
			const seconds = Math.floor(diff / 1000);

			if (daysEl) daysEl.textContent = days;
			if (hoursEl) hoursEl.textContent = pad(hours);
			if (minsEl) minsEl.textContent = pad(minutes);
			if (secsEl) secsEl.textContent = pad(seconds);

			// when it's Sunday at 10:00 (diff == 0) show 'In Service' briefly
			if (target - now <= 0) {
				if (noteEl) noteEl.textContent = 'In Service';
			} else {
				if (noteEl) noteEl.textContent = 'Sundays • 10:00 AM';
			}
		}

		updateCountdown();
		const timerId = setInterval(updateCountdown, 1000);
		// clear on unload
		window.addEventListener('beforeunload', function(){ clearInterval(timerId); });
	})();

		// responsive nav toggle
		const navToggle = document.querySelector('.nav-toggle');
	const navList = document.querySelector('header ul');
		if (navToggle) navToggle.innerHTML = '<i class="ri-menu-line"></i>';

		function closeNav() {
			document.body.classList.remove('nav-open');
			if (navToggle) {
				navToggle.classList.remove('open');
				navToggle.setAttribute('aria-expanded','false');
				navToggle.innerHTML = '<i class="ri-menu-line"></i>';
			}
		}

		function openNav() {
			document.body.classList.add('nav-open');
			if (navToggle) {
				navToggle.classList.add('open');
				navToggle.setAttribute('aria-expanded','true');
				navToggle.innerHTML = '<i class="ri-close-line"></i>';
			}
		}
	if (navToggle && navList) {
		navToggle.addEventListener('click', function(){
			if (document.body.classList.contains('nav-open')) closeNav(); else openNav();
		});

		// close when clicking a link — but don't close when the click is on a dropdown parent (mobile)
		navList.addEventListener('click', function(e){
			const a = e.target.closest('a');
			if (!a) return;
			const li = a.closest('li');
			// if it's a dropdown parent and on mobile, let the parent click handler toggle submenu
			if (li && li.classList.contains('dropdown') && window.innerWidth <= 900) return;
			closeNav();
		});

		// close on resize to desktop
		window.addEventListener('resize', function(){ if (window.innerWidth > 900) closeNav(); });
	}

	// allow dropdown toggling on mobile (click parent to expand)
	const dropdowns = document.querySelectorAll('li.dropdown');
	if (dropdowns.length) {
		dropdowns.forEach(function(li){
			const a = li.querySelector('a');
			if (!a) return;

			// mobile: click to toggle submenu
			a.addEventListener('click', function(e){
				if (window.innerWidth <= 900) {
					e.preventDefault();
					li.classList.toggle('open');
				}
			});

			// desktop: show submenu only when intentionally hovering (short delay)
			let enterTimer = null, leaveTimer = null;
			a.addEventListener('mouseenter', function(){
				if (window.innerWidth <= 900) return;
				clearTimeout(leaveTimer);
				enterTimer = setTimeout(function(){ li.classList.add('open'); }, 160);
			});
			a.addEventListener('mouseleave', function(){
				if (window.innerWidth <= 900) return;
				clearTimeout(enterTimer);
				leaveTimer = setTimeout(function(){ li.classList.remove('open'); }, 220);
			});
			li.addEventListener('mouseleave', function(){
				if (window.innerWidth <= 900) return;
				clearTimeout(enterTimer);
				leaveTimer = setTimeout(function(){ li.classList.remove('open'); }, 220);
			});
		});
	}
});

