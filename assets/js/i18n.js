// Simple client-side i18n using data-i18n attributes.
//
// Usage:
// 1) Add `data-i18n="key"` to any element whose innerText/html should be translated.
// 2) Add entries to the translations dictionary below.
// 3) Optionally add `data-i18n-attr="placeholder,title"` to translate attributes.
//
// The language is chosen in this order:
//   1) `?lang=` query param
//   2) saved selection in localStorage
//   3) browser language (first two letters)
//   4) fallback (default: en)
//
// You can force a language in JS via `window.setPageLanguage('es')`.
(function () {
	const STORAGE_KEY = 'lang';
	const DEFAULT_LANG = 'en';

	const translations = {
		en: {
			page_title: 'fernandito',
			main_heading: 'Fernando Gutierrez Canales',
			main_intro: 'Dr. in Astrophysics | Data Scientist | Writer',
			cv_link: 'Curriculum Vitae',
			cv_link_href: 'pdfs/CV_english.pdf',
			nav_about: 'About Me',
			nav_research: 'Research',
			nav_notes: 'Notes',
			nav_contact: 'Contact',
			section_about_title: 'About Me',
			section_research_title: 'Research',
			section_notes_title: 'Notes',
			section_contact_title: 'Contact',
			// Add more keys for other pieces of the UI as you mark them with data-i18n.
		},
		es: {
			page_title: 'fernandito',
			main_heading: 'Fernando Gutierrez Canales',
			main_intro: 'Doctor en Astrofísica | Científico de Datos | Escritor',
			cv_link: 'Currículum',
			cv_link_href: 'pdfs/CV_english.pdf',
			nav_about: 'Sobre mí',
			nav_research: 'Investigación',
			nav_notes: 'Notas',
			nav_contact: 'Contacto',
			section_about_title: 'Sobre mí',
			section_research_title: 'Investigación',
			section_notes_title: 'Notas',
			section_contact_title: 'Contacto',
			// Add more keys for other pieces of the UI as you mark them with data-i18n.
		},
	};

	const getPreferredLang = () => {
		const urlLang = new URLSearchParams(window.location.search).get('lang');
		if (urlLang && translations[urlLang]) return urlLang;

		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && translations[stored]) return stored;

		const nav = (navigator.language || '').slice(0, 2);
		if (nav && translations[nav]) return nav;

		return DEFAULT_LANG;
	};

	const translate = (lang) => {
		const dict = translations[lang] || translations[DEFAULT_LANG];

		document.querySelectorAll('[data-i18n]').forEach((el) => {
			const key = el.dataset.i18n;
			const text = dict[key];
			if (!text) return;

			if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
				el.value = text;
			} else {
				el.innerHTML = text;
			}
		});

		// Optional: translate attributes like placeholder, title, alt, etc.
		document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
			const attrs = (el.dataset.i18nAttr || '').split(',').map((a) => a.trim()).filter(Boolean);
			attrs.forEach((attr) => {
				const key = `${el.dataset.i18n || ''}_${attr}`.replace(/_$/, '');
				const text = dict[key];
				if (text) el.setAttribute(attr, text);
			});
		});

		const langSelect = document.getElementById('langSelect');
		if (langSelect) langSelect.value = lang;
	};

	const setLanguage = (lang) => {
		if (!translations[lang]) return;
		localStorage.setItem(STORAGE_KEY, lang);
		translate(lang);
	};

	document.addEventListener('DOMContentLoaded', () => {
		const lang = getPreferredLang();
		translate(lang);

		const select = document.getElementById('langSelect');
		if (select) {
			select.addEventListener('change', () => setLanguage(select.value));
		}
	});

	window.setPageLanguage = setLanguage;
})();
