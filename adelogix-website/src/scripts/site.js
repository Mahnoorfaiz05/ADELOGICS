/* Adelogix site script. No dependencies. Every feature degrades gracefully
   without JavaScript: links work, FAQs use <details>, the form posts normally. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var CONFIG = window.ADELOGIX || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- Menu */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(menu.hidden); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
      if (e.key === 'Tab' && !menu.hidden) {
        var focusables = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a, button')));
        var firstEl = focusables[0], lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });
  }

  /* -------------------------------------------------------------- Reveal */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------- Hero animations */
  document.querySelectorAll('svg[data-animated]').forEach(function (svg) {
    if (reduceMotion && svg.pauseAnimations) svg.pauseAnimations();
  });

  /* ------------------------------------------------- Header theme */
  // The header switches between dark and light glass depending on the
  // section underneath it. Dark sections carry [data-nav-dark].
  var header = document.querySelector('[data-header]');
  if (header) {
    var darkSections = Array.prototype.slice.call(document.querySelectorAll('[data-nav-dark]'));
    var ticking = false;
    var updateHeader = function () {
      ticking = false;
      var bar = header.querySelector('.header-bar');
      var probe = bar ? bar.getBoundingClientRect().top + bar.offsetHeight / 2 : 40;
      var dark = darkSections.some(function (el) {
        var r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      header.setAttribute('data-theme', dark ? 'dark' : 'light');
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateHeader();
  }

  /* --------------------------------------------------- Hero video */
  var video = document.querySelector('[data-hero-video]');
  if (video) {
    var toggleBtn = document.querySelector('[data-video-toggle]');
    var saveData = navigator.connection && navigator.connection.saveData;
    video.removeAttribute('controls');
    if (toggleBtn) toggleBtn.hidden = false;
    var setState = function (paused) {
      if (!toggleBtn) return;
      toggleBtn.setAttribute('data-state', paused ? 'paused' : 'playing');
      toggleBtn.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    };
    var tryPlay = function () {
      var p = video.play();
      if (p && p.catch) p.catch(function () { setState(true); });
    };
    video.addEventListener('play', function () { setState(false); });
    video.addEventListener('pause', function () { setState(true); });
    video.addEventListener('error', function () { if (toggleBtn) toggleBtn.hidden = true; }, true);
    var userPaused = false;
    if (toggleBtn) toggleBtn.addEventListener('click', function () {
      if (video.paused) { userPaused = false; tryPlay(); } else { userPaused = true; video.pause(); }
    });
    if (reduceMotion || saveData) setState(true);
    else if ('IntersectionObserver' in window) {
      // Play only while visible, to save battery and bandwidth.
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !userPaused) tryPlay();
          else if (!e.isIntersecting && !video.paused) video.pause();
        });
      }, { threshold: 0.25 }).observe(video);
    } else tryPlay();
  }

  /* ----------------------------------------------------- Carousels */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var dotsWrap = root.querySelector('[data-carousel-dots]');
    if (slides.length < 2) return;
    var step = function () { return slides[1].offsetLeft - slides[0].offsetLeft; };
    var perView = function () { return Math.max(1, Math.round(track.clientWidth / step())); };
    var pages = function () { return Math.max(1, slides.length - perView() + 1); };
    var current = function () { return Math.round(track.scrollLeft / step()); };
    var go = function (i) { track.scrollTo({ left: Math.max(0, Math.min(i, pages() - 1)) * step(), behavior: reduceMotion ? 'auto' : 'smooth' }); };
    var buildDots = function () {
      dotsWrap.innerHTML = '';
      var n = pages();
      dotsWrap.hidden = n < 2;
      for (var i = 0; i < n; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show feedback ' + (i + 1) + ' of ' + n);
        (function (idx) { b.addEventListener('click', function () { go(idx); }); })(i);
        dotsWrap.appendChild(b);
      }
      sync();
    };
    var sync = function () {
      var c = current(), n = pages();
      prev.disabled = c <= 0;
      next.disabled = c >= n - 1;
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.setAttribute('aria-current', String(i === c)); });
    };
    prev.addEventListener('click', function () { go(current() - 1); });
    next.addEventListener('click', function () { go(current() + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });
    var t;
    track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(sync, 60); }, { passive: true });
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(buildDots, 150); });
    buildDots();
  });

  /* ------------------------------------------- Case study expander */
  var caseStudy = document.querySelector('[data-case-study]');
  var caseToggle = document.querySelector('[data-case-toggle]');
  if (caseStudy && caseToggle) {
    var label = caseToggle.querySelector('[data-case-label]');
    var setCase = function (open, focus) {
      caseStudy.classList.toggle('is-collapsed', !open);
      caseToggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Hide the case study' : 'Read the case study';
      if (open && focus) {
        caseStudy.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
        caseStudy.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        var h = document.getElementById('case-title');
        if (h) h.focus({ preventScroll: true });
      }
    };
    setCase(location.hash === '#case-study', false);
    caseToggle.addEventListener('click', function () {
      var open = caseToggle.getAttribute('aria-expanded') !== 'true';
      setCase(open, open);
      if (open && history.replaceState) history.replaceState(null, '', '#case-study');
      if (!open && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    });
    window.addEventListener('hashchange', function () { if (location.hash === '#case-study') setCase(true, true); });
  }

  /* ------------------------------------------------------- Work filters */
  var filterBar = document.querySelector('[data-filter-bar]');
  if (filterBar) {
    filterBar.hidden = false;
    var cards = document.querySelectorAll('[data-filter-item]');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var value = btn.getAttribute('data-filter');
      filterBar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      cards.forEach(function (card) {
        var match = value === 'all' || (card.getAttribute('data-filter-item') || '').split(' ').indexOf(value) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      var live = document.querySelector('[data-filter-status]');
      if (live) live.textContent = shown + (shown === 1 ? ' project' : ' projects') + ' shown';
    });
  }

  /* ------------------------------------------------- Analytics helpers */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'), { link_text: (el.textContent || '').trim().slice(0, 80), page_path: location.pathname });
  });

  /* ------------------------------------------------------ Contact form */
  var form = document.querySelector('[data-contact-form]');
  if (form) initForm(form);

  function initForm(form) {
    var status = form.querySelector('[data-form-status]');
    var submit = form.querySelector('[type="submit"]');
    var started = Date.now();
    var phoneField = form.querySelector('[data-phone-field]');
    form.setAttribute('novalidate', '');

    // Preselect the service when arriving from a service page (?service=slug).
    var pre = new URLSearchParams(location.search).get('service');
    var select = form.querySelector('select[name="service"]');
    if (pre && select && select.querySelector('option[value="' + pre.replace(/[^a-z0-9-]/g, '') + '"]')) select.value = pre;

    // Show phone field only when a phone-based method is chosen.
    function syncPhone() {
      var method = (form.querySelector('input[name="contact_method"]:checked') || {}).value;
      var needsPhone = method === 'phone' || method === 'whatsapp';
      if (phoneField) {
        phoneField.hidden = !needsPhone;
        var input = phoneField.querySelector('input');
        input.required = needsPhone;
        if (!needsPhone) clearError(input);
      }
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'contact_method') syncPhone();
    });
    syncPhone();

    var messages = {
      name: 'Please tell us your name.',
      email: 'Please enter a valid business email address, for example name@company.com.',
      service: 'Please choose the service you need, or "Not sure yet".',
      details: 'Please add a few sentences about your project (at least 20 characters).',
      phone: 'Please enter a phone number we can reach you on, including the country code.',
    };

    function fieldOf(input) { return input.closest('.field'); }
    function setError(input, msg) {
      var field = fieldOf(input);
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      var err = field.querySelector('.field-error');
      if (err) err.textContent = msg;
    }
    function clearError(input) {
      var field = fieldOf(input);
      if (!field) return;
      field.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }
    function validateInput(input) {
      var v = (input.value || '').trim();
      var name = input.name;
      if (!input.required && !v) { clearError(input); return true; }
      var ok = true;
      if (input.required && !v) ok = false;
      else if (name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      else if (name === 'details') ok = v.length >= 20;
      else if (name === 'phone') ok = /^[+\d][\d\s().-]{6,}$/.test(v);
      if (ok) clearError(input); else setError(input, messages[name] || 'Please check this field.');
      return ok;
    }

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) validateInput(input); });
      input.addEventListener('input', function () { if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) validateInput(input); });
    });

    function showStatus(kind, html) {
      status.className = 'form-status form-status--' + kind + ' is-visible';
      status.innerHTML = html;
      status.setAttribute('tabindex', '-1');
      status.focus({ preventScroll: false });
    }
    function fallbackContact() {
      var parts = [];
      if (CONFIG.email) parts.push('email us at <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>');
      if (CONFIG.bookingUrl) parts.push('<a href="' + CONFIG.bookingUrl + '" target="_blank" rel="noopener">book a call</a>');
      return parts.length ? ' You can also ' + parts.join(' or ') + '.' : '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      var inputs = form.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([name=website]), select, textarea');
      var firstInvalid = null;
      inputs.forEach(function (input) {
        if (input.closest('[hidden]')) return;
        if (!validateInput(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        showStatus('error', '<strong>Please check the highlighted fields.</strong>');
        firstInvalid.focus();
        return;
      }

      // Spam checks: honeypot filled, or submitted implausibly fast.
      var honeypot = form.querySelector('input[name="website"]');
      if ((honeypot && honeypot.value) || Date.now() - started < 2500) {
        showStatus('error', '<strong>Your message could not be sent.</strong><span>Please wait a moment and try again.' + fallbackContact() + '</span>');
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        showStatus('warning', '<strong>The online form is not connected yet, so your message has not been sent.</strong><span>Nothing was submitted.' + (fallbackContact() || ' Please try again later.') + '</span>');
        return;
      }

      // Set dynamic Reply-To for FormSubmit using the visitor's email
      var replyToField = form.querySelector('input[name="_replyto"]');
      var emailField = form.querySelector('input[name="email"]');
      if (replyToField && emailField) {
        replyToField.value = emailField.value;
      }

      var formData = new FormData(form);
      formData.append('page', location.href);
      formData.append('elapsed_ms', Date.now() - started);

      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      submit.classList.add('is-loading');
      submit.setAttribute('aria-disabled', 'true');
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var firstName = String(data.name || '').trim().split(/\s+/)[0];
        form.reset();
        syncPhone();
        showStatus('success', '<strong>Thank you' + (firstName ? ', ' + escapeHtml(firstName) : '') + '. Your message has been sent.</strong><span>We will reply using your preferred contact method. If anything is urgent,' + (fallbackContact().replace(' You can also', '') || ' feel free to follow up.') + '</span>');
        track('generate_lead', { form: 'contact', service: data.service || '' });
      }).catch(function () {
        showStatus('error', '<strong>Sorry, your message was not sent.</strong><span>Please check your connection and try again.' + fallbackContact() + '</span>');
      }).finally(function () {
        submit.classList.remove('is-loading');
        submit.removeAttribute('aria-disabled');
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  /* ------------------------------------------------- Consent + GA4 */
  var KEY = 'adelogix-consent';
  function readConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function writeConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked */ } }
  function loadGA() {
    if (!CONFIG.ga4Id || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.ga4Id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.ga4Id, { anonymize_ip: true });
  }
  var banner = document.querySelector('[data-consent]');
  if (CONFIG.ga4Id && banner) {
    var choice = readConsent();
    if (choice === 'granted') loadGA();
    else if (!choice) banner.hidden = false;
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent-choice]');
      if (!btn) return;
      var v = btn.getAttribute('data-consent-choice');
      writeConsent(v);
      banner.hidden = true;
      if (v === 'granted') loadGA();
    });
  }
  document.querySelectorAll('[data-consent-open]').forEach(function (b) {
    if (!CONFIG.ga4Id) { b.closest('li').hidden = true; return; }
    b.addEventListener('click', function () { if (banner) banner.hidden = false; });
  });

  /* -------------------------------------------------- Review flag */
  var flag = document.querySelector('[data-review-flag]');
  if (flag) {
    try { if (sessionStorage.getItem('review-flag-closed')) flag.hidden = true; } catch (e) { /* ignore */ }
    flag.querySelector('button').addEventListener('click', function () {
      flag.hidden = true;
      try { sessionStorage.setItem('review-flag-closed', '1'); } catch (e) { /* ignore */ }
    });
  }

  /* ------------------------------------------------------- Chatbot */
  (function () {
    'use strict';

    var root = document.documentElement;
    var chatbot = document.querySelector('[data-chatbot]');
    var launcher = document.querySelector('[data-chatbot-toggle]');
    var windowEl = document.querySelector('[data-chatbot-window]');
    var messagesEl = document.querySelector('[data-chatbot-messages]');
    var suggestedEl = document.querySelector('[data-chatbot-suggested]');
    var formEl = document.querySelector('[data-chatbot-form]');
    var inputEl = document.querySelector('[data-chatbot-input]');
    var sendBtn = document.querySelector('[data-chatbot-send]');
    var newBtn = document.querySelector('[data-chatbot-new]');
    var knowledgeEl = document.querySelector('[data-chatbot-knowledge]');

    if (!chatbot || !launcher || !windowEl || !knowledgeEl) return;

    // Load knowledge base embedded in the page
    var knowledge = null;
    try {
      knowledge = JSON.parse(knowledgeEl.textContent);
    } catch (e) {
      return; // No knowledge base available
    }

    var faqEntries = knowledge.faqEntries || [];
    var suggested = knowledge.suggestedQuestions || [];
    var welcome = knowledge.welcomeMessage || { text: 'Hello! How can I help?' };

    var isOpen = false;
    var isTyping = false;

    // Escape HTML for safe insertion
    function esc(s) {
      return String(s).replace(/[&<>\"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    // Match user message to best FAQ entry using keyword scoring
    function findResponse(message) {
      var normalized = (message || '').toLowerCase().trim();
      if (!normalized) return faqEntries.find(function (e) { return e.id === 'fallback'; }) || {};

      var best = faqEntries.find(function (e) { return e.id === 'fallback'; }) || {};
      var bestScore = 0;

      faqEntries.forEach(function (entry) {
        if (entry.id === 'fallback') return;
        var score = 0;
        entry.patterns.forEach(function (pattern) {
          if (normalized.indexOf(pattern.toLowerCase()) !== -1) {
            score += pattern.length;
          }
        });
        if (score > bestScore) {
          bestScore = score;
          best = entry;
        }
      });

      return bestScore > 0 ? best : (faqEntries.find(function (e) { return e.id === 'fallback'; }) || {});
    }

    // Render a message bubble
    function createMessage(text, isUser, links) {
      var wrap = document.createElement('div');
      wrap.className = 'chatbot__message' + (isUser ? ' chatbot__message--user' : ' chatbot__message--bot');

      var avatar = document.createElement('div');
      avatar.className = 'chatbot__avatar';
      avatar.textContent = isUser ? 'A' : 'A';

      var bubble = document.createElement('div');
      bubble.className = 'chatbot__bubble';
      bubble.innerHTML = esc(text);

      if (links && links.length) {
        var linksList = document.createElement('ul');
        links.forEach(function (link) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = link.url;
          a.textContent = link.text;
          a.target = '_blank';
          a.rel = 'noopener';
          li.appendChild(a);
          linksList.appendChild(li);
        });
        bubble.appendChild(linksList);
      }

      wrap.appendChild(isUser ? bubble : avatar);
      if (!isUser) wrap.appendChild(bubble);
      if (isUser) wrap.appendChild(avatar);

      return wrap;
    }

    // Show typing indicator
    function showTyping() {
      isTyping = true;
      var typing = document.createElement('div');
      typing.className = 'chatbot__typing';
      typing.setAttribute('data-chatbot-typing', '');
      typing.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typing);
      scrollToBottom();
    }

    function hideTyping() {
      isTyping = false;
      var typing = document.querySelector('[data-chatbot-typing]');
      if (typing) typing.remove();
    }

    // Scroll messages to bottom
    function scrollToBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Add suggested question chips — show only 2–3 initially to keep
    // the conversation area as the primary focus
    function renderSuggested() {
      if (!suggested.length) return;
      suggestedEl.innerHTML = '<p>Try asking:</p><div class="chatbot__chips"></div>';
      var chipsWrap = suggestedEl.querySelector('.chatbot__chips');
      var limit = Math.min(suggested.length, 3);
      for (var i = 0; i < limit; i++) {
        (function (q) {
          var chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'chatbot__chip';
          chip.textContent = q;
          chip.addEventListener('click', function () {
            inputEl.value = q;
            inputEl.focus();
            hideSuggestions();
            formEl.dispatchEvent(new Event('submit'));
          });
          chipsWrap.appendChild(chip);
        })(suggested[i]);
      }
      suggestedEl.removeAttribute('data-suggestions-hidden');
    }

    // Hide the suggestions section after first user interaction
    function hideSuggestions() {
      suggestedEl.setAttribute('data-suggestions-hidden', '');
    }

    // Render welcome message
    function renderWelcome() {
      var msg = createMessage(welcome.text, false, welcome.links || []);
      messagesEl.appendChild(msg);
      scrollToBottom();
    }

    // Add bot response after delay
    function respond(message) {
      var entry = findResponse(message);
      setTimeout(function () {
        hideTyping();
        var msg = createMessage(entry.response || 'I am not sure about that. Please contact the team.', false, entry.links || []);
        messagesEl.appendChild(msg);
        scrollToBottom();
      }, 700);
    }

    // Toggle chat window
    function setOpen(open) {
      isOpen = open;
      windowEl.classList.toggle('is-visible', open);
      windowEl.toggleAttribute('hidden', !open);
      launcher.setAttribute('aria-expanded', String(open));
      launcher.querySelector('.chatbot__launcher-text').textContent = open ? 'Close' : 'Chat';
      if (open) {
        launcher.querySelector('.chatbot__launcher-pulse').style.display = 'none';
        inputEl.focus();
        if (messagesEl.children.length === 0) {
          renderSuggested();
          renderWelcome();
        }
      }
    }

    // Reset to new conversation
    function newConversation() {
      messagesEl.innerHTML = '';
      suggestedEl.innerHTML = '';
      renderSuggested();
      renderWelcome();
      scrollToBottom();
    }

    // Events
    launcher.addEventListener('click', function () { setOpen(!isOpen); });

    newBtn.addEventListener('click', function () {
      newConversation();
      if (!isOpen) setOpen(true);
    });

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = (inputEl.value || '').trim();
      if (!text || isTyping) return;

      // Hide suggestions once the user starts typing their own message
      hideSuggestions();

      // User message
      var userMsg = createMessage(text, true);
      messagesEl.appendChild(userMsg);
      inputEl.value = '';
      scrollToBottom();

      // Bot response
      showTyping();
      respond(text);
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', function (e) {
      if (isOpen && !chatbot.contains(e.target)) {
        // Only close if clicking far outside (not on launcher)
        if (!launcher.contains(e.target) && !windowEl.contains(e.target)) {
          setOpen(false);
        }
      }
    });

    // Start closed
    setOpen(false);
  })();
})();
