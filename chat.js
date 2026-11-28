/* DeedCode assistant: answers questions, captures leads, hands over to Duncan on WhatsApp.
   Works on plain GitHub Pages with no server. To add real AI answers, deploy the optional
   worker in /_worker and paste its URL into AI_API below (or set window.DEEDCODE_CHAT_API). */
(function () {
  "use strict";
  if (window.__dcChat) return;
  window.__dcChat = 1;

  var WA = "254703545010";
  var AJAX = "https://formsubmit.co/ajax/info@deedcode.com";
  var AI_API = window.DEEDCODE_CHAT_API || ""; // optional, see _worker/README.txt
  var d = document, w = window;

  function wa(text) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); }
  var WA_HI = wa("Hi Duncan, I was chatting on the DeedCode site and I would like to talk.");

  /* ---------- knowledge base ---------- */
  var KB = [
    { k: /\b(agent|human|person|real person|someone|talk to (a )?(man|woman|duncan)|call me|speak to)\b/,
      a: "Of course. Duncan answers personally on WhatsApp, usually the same day. Tap below and your message goes straight to him.",
      act: [{ t: "Message Duncan on WhatsApp", h: WA_HI }] },
    { k: /\b(audit|quote|get started|start|sign up|hire|interested|proposal|demo)\b/, lead: true },
    { k: /(international pric|usd|dollar)|(?=.*\b(price|pricing|cost|how much|charge|fee)\b)(?=.*(uganda|tanzania|rwanda|nigeria|ghana|south africa|\buk\b|\busa\b|america|europe|canada|dubai|\buae\b|india|australia|abroad|overseas|outside kenya|international))/,
      a: "For businesses outside Kenya the plans are about USD 79 setup + USD 19 a month (Starter), USD 199 + USD 35 a month (Growth) and USD 319 + USD 59 a month (Collections Pro). Final figures are confirmed in writing after your free audit.",
      chips: ["Get my free audit", "What is the guarantee?"] },
    { k: /(outside kenya|international|abroad|overseas|worldwide|diaspora|uganda|tanzania|rwanda|nigeria|ghana|south africa|\buk\b|\busa\b|america|europe|canada|dubai|\buae\b|india|australia|other countr|my country|foreign|usd|dollar)/,
      a: "Yes, we work with businesses outside Kenya too. WhatsApp works everywhere, so the assistant, bookings and lead capture work the same. Instead of M-Pesa we connect card, PayPal, Stripe or your local payment method, and we bill you in US dollars. During your free audit we confirm exactly what is possible in your country.",
      chips: ["International pricing", "Get my free audit"] },
    { k: /(price|pricing|cost|how much|charge|fee|afford|cheap|expensive|\bplans?\b|package|\bbei\b|ngapi|gharama)/,
      a: "Three plans, no lock-in:\n\nStarter: KES 9,500 setup + KES 2,500 a month\nGrowth: KES 24,500 setup + KES 4,500 a month (most popular, includes M-Pesa payments)\nCollections Pro: KES 39,500 setup + KES 7,500 a month\n\nCustom systems start at KES 79,000. Outside Kenya? Ask me for dollar pricing.",
      chips: ["International pricing", "Get my free audit"], act: [{ t: "See full pricing", h: "/pricing" }] },
    { k: /(how long|how fast|days|timeline|when.*(live|ready)|turnaround|deliver)/,
      a: "Live in 7 days once we have your business details and access. Day 1 we start, days 2 to 4 we build, day 5 we connect, day 6 we test, day 7 you go live. Safaricom and Meta approvals are decided by them, and delays on their side do not count against our 7 days.",
      act: [{ t: "How it works", h: "/how-it-works" }] },
    { k: /(guarantee|refund|money.?back|risk|lock.?in|cancel|scam|trust|legit)/,
      a: "Three written promises: built and tested in 7 days (or your first month of care is free), a 90-day money-back guarantee (if we cannot put it right, you get every shilling back and you keep your website), and no lock-in. Care and hosting is month to month, and you keep your data, domain and WhatsApp number.",
      act: [{ t: "Read the guarantee", h: "/guarantee" }] },
    { k: /(m-?pesa|mpesa|till|paybill|daraja|payment|pay |paying|stk|receipt|invoice|collect)/,
      a: "Customers pay inside the WhatsApp chat. The M-Pesa request lands on their phone once, only after they tap pay, or they can pay your Till or Paybill themselves. A receipt goes back in seconds. Money settles straight into your own Till or Paybill, we never hold a shilling. Outside Kenya we use card, PayPal or Stripe instead.",
      chips: ["How long does it take?", "Get my free audit"] },
    { k: /(whatsapp|assistant|\bbot\b|chatbot|automat|reply|booking|appointment|24\/7|night|sleep|what do you do|what is deedcode|services|offer|do for)/,
      a: "DeedCode builds a WhatsApp assistant for your business. It replies to customers in seconds, day and night, in English or Kiswahili, answers your prices and hours, books appointments, collects payments, sends receipts and follows up leads. When a person is needed, or a customer types \"agent\", it hands over to you or your staff.",
      chips: ["Pricing", "Which businesses?", "Get my free audit"], act: [{ t: "All services", h: "/services" }] },
    { k: /(clinic|hospital|dental|school|college|sacco|chama|real estate|property|landlord|apartment|law|lawyer|account|consult|gym|spa|salon|car hire|tour|driving|wholesale|distribut|industr|business type|my business|kind of business|which business)/,
      a: "We shape it for private clinics, property managers and serviced apartments, schools and colleges, SACCOs and chamas, law, accounting and consulting firms, gyms, spas and salons, car hire, tours and driving schools, and wholesalers and distributors. If your customers message you, book you or pay you, it will work for you.",
      chips: ["Get my free audit", "Pricing"] },
    { k: /(website|web site|landing page|web design|site for)/,
      a: "Yes, we build fast mobile websites and landing pages that sell, and they come with the plans. If you only want a website on its own, message Duncan for a quote.",
      act: [{ t: "Ask Duncan for a website quote", h: wa("Hi Duncan, I would like a quote for a website.") }] },
    { k: /(data|privacy|secure|safe|gdpr|personal information|dpa)/,
      a: "We only use your customers' details for your business, and we never hold your money. Our privacy policy explains what we collect and how to request your data.",
      act: [{ t: "Privacy policy", h: "/privacy" }] },
    { k: /(contact|email|phone|number|where|location|office|nairobi|address|hours|open)/,
      a: "DeedCode is run by Duncan K. Kigen from Nairobi, Kenya.\nWhatsApp / phone: +254 703 545 010\nEmail: info@deedcode.com",
      act: [{ t: "Chat on WhatsApp", h: WA_HI }] },
    { k: /\b(habari|mambo|sasa|hujambo|jambo|niaje)\b/,
      a: "Habari! Karibu DeedCode. Ninaweza kukusaidia na maswali kuhusu WhatsApp ya biashara, bei, na jinsi tunavyofanya kazi. Unaweza kuuliza kwa Kiswahili au Kiingereza.",
      chips: ["Bei", "Get my free audit"] },
    { k: /^(hi|hello|hey|good (morning|afternoon|evening)|howdy|greetings)\b/,
      a: "Hello! I am DeedCode's assistant. Ask me anything about the WhatsApp assistant, pricing or how it works, or I can get you a free audit.",
      chips: ["What do you do?", "Pricing", "Get my free audit"] },
    { k: /(thank|thanks|asante|great|awesome|cool|ok(ay)?$)/,
      a: "You are welcome! Anything else I can help with?", chips: ["Get my free audit", "Talk to Duncan"] }
  ];

  var CHIP_MAP = { "talk to duncan": "agent", "which businesses?": "which business", "what is the guarantee?": "guarantee", "how long does it take?": "how long", "bei": "price", "international pricing": "international pric" };

  /* ---------- state ---------- */
  var S = { open: false, msgs: [], lead: null, miss: 0, asked: [] };
  try { var sv = sessionStorage.getItem("dcc"); if (sv) { var p = JSON.parse(sv); if (p && p.msgs) { S.msgs = p.msgs; S.miss = p.miss || 0; S.asked = p.asked || []; } } } catch (e) {}
  function save() { try { sessionStorage.setItem("dcc", JSON.stringify({ msgs: S.msgs.slice(-40), miss: S.miss, asked: S.asked.slice(-10) })); } catch (e) {} }

  /* ---------- styles ---------- */
  var css = [
    ".dcc,.dcc *{box-sizing:border-box}",
    ".dcc{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0B1426}",
    ".dcc-l{position:fixed;right:16px;bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:50;display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:#00E060;color:#060C1A;font:800 .95rem/1 Inter,system-ui,sans-serif;padding:14px 18px 14px 14px;border-radius:999px;box-shadow:0 14px 34px -8px rgba(0,224,96,.65),0 2px 8px rgba(6,12,26,.25);-webkit-tap-highlight-color:transparent}",
    ".dcc-l svg{width:26px;height:26px;flex:none}",
    ".dcc-l:hover{background:#33F084}",
    ".dcc-l:focus-visible,.dcc-x:focus-visible,.dcc-s:focus-visible,.dcc-c:focus-visible,.dcc-a:focus-visible,.dcc-in:focus-visible{outline:3px solid #060C1A;outline-offset:2px}",
    ".dcc-l span{display:none}.dcc-l{padding:14px;width:58px;height:58px;justify-content:center}",
    "@media(min-width:760px){.dcc-l{right:24px;bottom:98px;width:auto;height:auto;padding:14px 18px 14px 14px}.dcc-l span{display:inline}}",
    "body.mo .dcc-l,body.mo .dcc-g{display:none}",
    ".dcc-g{position:fixed;right:16px;bottom:calc(152px + env(safe-area-inset-bottom,0px));z-index:50;max-width:250px;background:#fff;border-radius:16px 16px 4px 16px;padding:12px 30px 12px 14px;font:600 .9rem/1.4 Inter,system-ui,sans-serif;color:#0B1426;box-shadow:0 14px 40px -10px rgba(6,12,26,.45);border:1px solid #E3E8F0;animation:dccIn .35s ease both}",
    "@media(min-width:760px){.dcc-g{right:24px;bottom:160px}}",
    ".dcc-g button{position:absolute;top:4px;right:6px;border:0;background:none;font-size:20px;line-height:1;color:#4B5568;cursor:pointer;padding:4px 6px}",
    ".dcc-p{position:fixed;z-index:60;inset:0;display:none;flex-direction:column;background:#fff;height:100vh;height:100dvh}",
    ".dcc-p.on{display:flex;animation:dccIn .25s ease both}",
    "@media(min-width:760px){.dcc-p{inset:auto 24px 24px auto;width:390px;height:min(620px,calc(100vh - 48px));border-radius:22px;box-shadow:0 30px 80px -20px rgba(6,12,26,.55);border:1px solid #E3E8F0;overflow:hidden}}",
    ".dcc-h{display:flex;align-items:center;gap:12px;padding:14px 16px;padding-top:calc(14px + env(safe-area-inset-top,0px));background:#060C1A;color:#fff}",
    ".dcc-av{width:40px;height:40px;border-radius:50%;background:#00E060;color:#060C1A;display:grid;place-items:center;font:900 1.1rem Inter,system-ui,sans-serif;flex:none;position:relative}",
    ".dcc-av::after{content:'';position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;background:#00E060;border:2px solid #060C1A}",
    ".dcc-ht{flex:1;min-width:0}.dcc-ht b{display:block;font:800 1rem/1.2 Inter,system-ui,sans-serif;color:#fff}.dcc-ht span{display:block;font:500 .78rem/1.3 Inter,system-ui,sans-serif;color:#9FB0C8}",
    ".dcc-x{border:0;background:rgba(255,255,255,.1);color:#fff;width:40px;height:40px;border-radius:12px;font-size:24px;line-height:1;cursor:pointer;flex:none}",
    ".dcc-x:hover{background:rgba(255,255,255,.2)}",
    ".dcc-m{flex:1;overflow-y:auto;padding:16px 14px;background:#F2F5FA;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}",
    ".dcc-b{max-width:86%;padding:11px 14px;border-radius:16px;font:500 .95rem/1.5 Inter,system-ui,sans-serif;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:anywhere;animation:dccIn .25s ease both}",
    ".dcc-b.b{align-self:flex-start;background:#fff;color:#0B1426;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(6,12,26,.08)}",
    ".dcc-b.u{align-self:flex-end;background:#060C1A;color:#fff;border-bottom-right-radius:4px}",
    ".dcc-ty{align-self:flex-start;background:#fff;border-radius:16px;border-bottom-left-radius:4px;padding:13px 16px;display:flex;gap:5px}",
    ".dcc-ty i{width:7px;height:7px;border-radius:50%;background:#9AA6B8;animation:dccB 1s infinite}.dcc-ty i:nth-child(2){animation-delay:.15s}.dcc-ty i:nth-child(3){animation-delay:.3s}",
    ".dcc-r{display:flex;flex-wrap:wrap;gap:8px;align-self:flex-start;max-width:96%}",
    ".dcc-c{border:1.5px solid #060C1A;background:#fff;color:#060C1A;border-radius:999px;padding:9px 14px;font:700 .86rem/1 Inter,system-ui,sans-serif;cursor:pointer;min-height:40px}",
    ".dcc-c:hover{background:#060C1A;color:#fff}",
    ".dcc-a{display:inline-block;align-self:flex-start;background:#00E060;color:#060C1A;text-decoration:none;border-radius:999px;padding:11px 16px;font:800 .88rem/1.2 Inter,system-ui,sans-serif;min-height:40px}",
    ".dcc-a:hover{background:#33F084}",
    ".dcc-f{display:flex;gap:8px;padding:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px));background:#fff;border-top:1px solid #E3E8F0}",
    ".dcc-in{flex:1;min-width:0;border:1.5px solid #D5DCE8;border-radius:999px;padding:12px 16px;font:500 16px Inter,system-ui,sans-serif;color:#0B1426;background:#fff}",
    ".dcc-s{border:0;background:#00E060;color:#060C1A;width:46px;height:46px;border-radius:50%;cursor:pointer;display:grid;place-items:center;flex:none}",
    ".dcc-s:disabled{opacity:.5;cursor:default}",
    ".dcc-n{padding:0 14px 10px;background:#fff;font:500 .72rem/1.4 Inter,system-ui,sans-serif;color:#6B7689;text-align:center}",
    "@keyframes dccIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    "@keyframes dccB{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}",
    "@media(prefers-reduced-motion:reduce){.dcc *,.dcc-g,.dcc-p{animation:none!important}}"
  ].join("\n");
  var st = d.createElement("style"); st.textContent = css; d.head.appendChild(st);

  /* ---------- DOM ---------- */
  var root = d.createElement("div"); root.className = "dcc";
  root.innerHTML =
    '<button type="button" class="dcc-l" aria-haspopup="dialog" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="#060C1A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 11h7M8.5 14h4"/></svg><span>Ask us anything</span></button>' +
    '<div class="dcc-p" role="dialog" aria-label="DeedCode assistant" aria-modal="false">' +
    '<div class="dcc-h"><div class="dcc-av" aria-hidden="true">D</div><div class="dcc-ht"><b>DeedCode Assistant</b><span>Automated, replies instantly, 24/7</span></div><button type="button" class="dcc-x" aria-label="Close chat">&times;</button></div>' +
    '<div class="dcc-m" role="log" aria-live="polite"></div>' +
    '<form class="dcc-f" autocomplete="off"><input class="dcc-in" type="text" name="q" placeholder="Type your question..." aria-label="Your message" maxlength="400" enterkeyhint="send"><button class="dcc-s" type="submit" aria-label="Send"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#060C1A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg></button></form>' +
    '<div class="dcc-n">I am an automated assistant. Duncan answers personally on WhatsApp.</div></div>';
  d.body.appendChild(root);

  var L = root.querySelector(".dcc-l"), P = root.querySelector(".dcc-p"), M = root.querySelector(".dcc-m"),
    F = root.querySelector(".dcc-f"), IN = root.querySelector(".dcc-in"), X = root.querySelector(".dcc-x"), SB = root.querySelector(".dcc-s");
  var greet = null, greetTimer = null, busy = false;

  /* ---------- rendering ---------- */
  function scroll() { M.scrollTop = M.scrollHeight; }
  function clearOptions() { [].forEach.call(M.querySelectorAll(".dcc-r,.dcc-a"), function (n) { n.parentNode.removeChild(n); }); }
  function bubble(role, text) {
    var b = d.createElement("div"); b.className = "dcc-b " + role; b.textContent = text; M.appendChild(b); scroll();
  }
  function chips(list) {
    if (!list || !list.length) return;
    var r = d.createElement("div"); r.className = "dcc-r";
    list.forEach(function (c) {
      var b = d.createElement("button"); b.type = "button"; b.className = "dcc-c"; b.textContent = c;
      b.addEventListener("click", function () { handle(c, true); }); r.appendChild(b);
    });
    M.appendChild(r); scroll();
  }
  function actions(list) {
    if (!list) return;
    list.forEach(function (a) {
      var l = d.createElement("a"); l.className = "dcc-a"; l.textContent = a.t + " \u2192"; l.href = a.h;
      if (/^https?:/.test(a.h)) { l.target = "_blank"; l.rel = "noopener"; }
      M.appendChild(l);
    });
    scroll();
  }
  function replay() {
    M.innerHTML = "";
    S.msgs.forEach(function (m) { bubble(m.r, m.t); });
  }
  function say(text, o) {
    o = o || {};
    var ty = d.createElement("div"); ty.className = "dcc-ty"; ty.innerHTML = "<i></i><i></i><i></i>"; M.appendChild(ty); scroll();
    busy = true;
    var delay = Math.min(1100, 350 + text.length * 6);
    setTimeout(function () {
      if (ty.parentNode) ty.parentNode.removeChild(ty);
      bubble("b", text); S.msgs.push({ r: "b", t: text }); save();
      actions(o.act); chips(o.chips); busy = false;
      if (o.done) o.done();
    }, delay);
  }

  /* ---------- lead capture ---------- */
  var STEPS = [
    { key: "name", q: "Happy to help. First, what is your name?" },
    { key: "whatsapp", q: "Thanks, {name}. What is your WhatsApp number, with country code? (for example +254 7XX XXX XXX)" },
    { key: "business", q: "What does your business do?" },
    { key: "country", q: "And which country is your business based in?", chips: ["Kenya", "Uganda", "Tanzania", "Somewhere else"] },
    { key: "confirm", q: "", chips: ["Yes, send it", "Cancel"] }
  ];
  function startLead() {
    S.lead = { i: 0, data: {} };
    say(STEPS[0].q, { chips: ["Cancel"] });
  }
  function leadInput(txt) {
    var s = STEPS[S.lead.i], v = txt.trim();
    if (/^(cancel|stop|no|never ?mind)$/i.test(v)) { S.lead = null; say("No problem, nothing was sent. Ask me anything else, or message Duncan directly any time.", { act: [{ t: "Chat on WhatsApp", h: WA_HI }], chips: ["Pricing", "How long does it take?"] }); return; }
    if (s.key === "confirm") {
      if (/^(yes|yeah|yep|ok|okay|sure|send)/i.test(v)) { submitLead(); }
      else { say("Please tap \"Yes, send it\" to send, or \"Cancel\" to stop.", { chips: ["Yes, send it", "Cancel"] }); }
      return;
    }
    if (s.key === "whatsapp" && !/^\+?[\d\s\-()]{7,20}$/.test(v)) { say("That does not look like a phone number. Please type it with the country code, for example +254 7XX XXX XXX.", { chips: ["Cancel"] }); return; }
    if (v.length < 2) { say("Could you type that again?", { chips: ["Cancel"] }); return; }
    S.lead.data[s.key] = v.slice(0, 200);
    S.lead.i++;
    var n = STEPS[S.lead.i];
    if (n.key === "confirm") {
      var dd = S.lead.data;
      say("Here is what I will send to Duncan:\n\nName: " + dd.name + "\nWhatsApp: " + dd.whatsapp + "\nBusiness: " + dd.business + "\nCountry: " + dd.country + "\n\nBy sending, you agree DeedCode may contact you on WhatsApp about this request, as set out in the privacy policy.", { chips: n.chips, act: [{ t: "Privacy policy", h: "/privacy" }] });
    } else {
      say(n.q.replace("{name}", S.lead.data.name.split(" ")[0]), { chips: n.chips ? n.chips.concat(["Cancel"]) : ["Cancel"] });
    }
  }
  function submitLead() {
    var dd = S.lead.data; S.lead = null; busy = true;
    var payload = {
      _subject: "New lead: DeedCode chat assistant", _captcha: "false", _template: "table",
      name: dd.name, whatsapp: dd.whatsapp, business: dd.business, country: dd.country,
      page: location.pathname, questions_asked: S.asked.join(" | ") || "none", consent: "yes (chat)"
    };
    var ok = function () {
      busy = false;
      say("Done, " + dd.name.split(" ")[0] + ". Duncan will message you on WhatsApp soon with your free audit. Want to skip the wait? Tap below to message him now.", { act: [{ t: "Message Duncan now", h: wa("Hi Duncan, it is " + dd.name + ". I just left my details on the DeedCode site for " + dd.business + ".") }] });
    };
    var bad = function () {
      busy = false;
      say("Sorry, that did not go through. Please tap below to send it to Duncan on WhatsApp instead.", { act: [{ t: "Send on WhatsApp", h: wa("Hi Duncan, I am " + dd.name + " (" + dd.whatsapp + "). My business: " + dd.business + " in " + dd.country + ". I would like a free audit.") }] });
    };
    fetch(AJAX, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(ok).catch(bad);
  }

  /* ---------- answering ---------- */
  function answer(txt) {
    var q = txt.toLowerCase().replace(/\s+/g, " ").trim();
    for (var i = 0; i < KB.length; i++) {
      if (KB[i].k.test(q)) {
        S.miss = 0;
        if (KB[i].lead) { startLead(); return; }
        say(KB[i].a, { chips: KB[i].chips, act: KB[i].act });
        return;
      }
    }
    S.miss++;
    if (AI_API) { askAI(txt); return; }
    if (S.miss >= 2) {
      say("I want you to get a proper answer, not a guess. Leave your details and Duncan will reply personally, or message him now.", { chips: ["Get my free audit"], act: [{ t: "Message Duncan on WhatsApp", h: wa("Hi Duncan, I have a question: " + txt.slice(0, 200)) }] });
    } else {
      say("I am not sure I understood that. I can help with what we do, pricing, how long it takes, the guarantee, payments and working outside Kenya. Or I can connect you with Duncan.", { chips: ["What do you do?", "Pricing", "Talk to Duncan"] });
    }
  }
  function askAI(txt) {
    var ty = d.createElement("div"); ty.className = "dcc-ty"; ty.innerHTML = "<i></i><i></i><i></i>"; M.appendChild(ty); scroll(); busy = true;
    var history = S.msgs.slice(-8).map(function (m) { return { role: m.r === "u" ? "user" : "assistant", content: m.t }; });
    var ctl = w.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    fetch(AI_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        clearTimeout(to); if (ty.parentNode) ty.parentNode.removeChild(ty); busy = false;
        var t = (j && j.reply) ? String(j.reply).slice(0, 900) : "";
        if (!t) throw 0;
        bubble("b", t); S.msgs.push({ r: "b", t: t }); save(); chips(["Get my free audit", "Talk to Duncan"]);
      })
      .catch(function () {
        clearTimeout(to); if (ty.parentNode) ty.parentNode.removeChild(ty); busy = false;
        say("Let me connect you with Duncan so you get an exact answer.", { act: [{ t: "Message Duncan on WhatsApp", h: wa("Hi Duncan, I have a question: " + txt.slice(0, 200)) }], chips: ["Get my free audit"] });
      });
  }
  function handle(txt, fromChip) {
    if (busy) return;
    txt = (txt || "").trim(); if (!txt) return;
    clearOptions();
    bubble("u", txt); S.msgs.push({ r: "u", t: txt });
    if (!S.lead && S.asked.indexOf(txt) < 0) S.asked.push(txt.slice(0, 80));
    save();
    if (S.lead) { leadInput(txt); return; }
    var lc = txt.toLowerCase();
    answer(CHIP_MAP[lc] || txt);
  }

  /* ---------- open / close ---------- */
  function hideGreet() { if (greet && greet.parentNode) greet.parentNode.removeChild(greet); greet = null; clearTimeout(greetTimer); try { sessionStorage.setItem("dccg", "1"); } catch (e) {} }
  function open() {
    S.open = true; hideGreet(); P.classList.add("on"); L.style.display = "none"; L.setAttribute("aria-expanded", "true");
    if (!M.childNodes.length) {
      if (S.msgs.length) { replay(); }
      else {
        var hello = "Hi, I am DeedCode's assistant. I can answer questions about the WhatsApp assistant, pricing and how it works, 24/7. I can also get you a free audit from Duncan, the founder.";
        say(hello, { chips: ["What do you do?", "Pricing", "Do you work outside Kenya?", "Get my free audit"] });
      }
    }
    if (w.innerWidth >= 760) setTimeout(function () { IN.focus(); }, 60);
    scroll();
  }
  function close() {
    S.open = false; P.classList.remove("on"); L.style.display = ""; L.setAttribute("aria-expanded", "false"); L.focus();
  }
  L.addEventListener("click", open);
  X.addEventListener("click", close);
  d.addEventListener("keydown", function (e) { if (e.key === "Escape" && S.open) close(); });
  F.addEventListener("submit", function (e) { e.preventDefault(); var v = IN.value; IN.value = ""; handle(v); });

  /* ---------- gentle greeting bubble, once per visit ---------- */
  var seen = false; try { seen = sessionStorage.getItem("dccg") === "1" || S.msgs.length > 0; } catch (e) {}
  if (!seen && !/\/(thank-you|404)/.test(location.pathname)) {
    greetTimer = setTimeout(function () {
      if (S.open) return;
      greet = d.createElement("div"); greet.className = "dcc-g"; greet.setAttribute("role", "status");
      greet.innerHTML = "Questions about pricing or how it works? Ask me, I reply instantly.<button type=\"button\" aria-label=\"Dismiss\">&times;</button>";
      greet.addEventListener("click", function (e) { if (e.target.tagName === "BUTTON") { hideGreet(); } else { open(); } });
      root.appendChild(greet);
    }, 9000);
  }
})();
