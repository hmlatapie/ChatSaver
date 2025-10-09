(() => {
  // One-shot async runner (prevents stray top-level await)
  const run = async () => {
    const startedAt = new Date();
    const isoSafe = (d = new Date()) =>
      d.toISOString().replace(/:/g, "-");

    const platform =
      /chatgpt\.com$/i.test(location.host) ? "openai" :
      /grok\.com$/i.test(location.host)    ? "grok"   :
      "unknown";

    const scope = platform === "grok" ? "CURRENT" : "VISIBLE";

    // Snapshot file-level meta BEFORE any navigation / iframe loads
    const exportMeta = {
      exportedAt: new Date().toISOString(),
      platform,
      pageTitle: document.title,
      pageURL: location.href,
      scope,
      format: "JSON",
      version: "1"
    };

    const log = (...args) => console.log(...args);
    const warn = (...args) => console.warn(...args);
    const err  = (...args) => console.error(...args);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const IFRAME_LOAD_TIMEOUT = 30000;   // 30s per convo load
    const DOM_STABLE_TIMEOUT  = 25000;   // 25s to finish autoscroll/materialization
    const DOM_STABLE_POLL_MS  = 500;

    const getAbs = (href) => {
      try { return new URL(href, location.origin).href; }
      catch { return href; }
    };

    const downloadJSON = (obj, fname) => {
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 0);
    };

    // ---------- Message extraction helpers ----------
    const extractMessagesFromDoc = async (doc) => {
      // Auto-scroll container and wait for stabilization
      const scrollAndWait = async () => {
        const root = doc;
        const findScrollEl = () => {
          // Try the main chat scroller variants used over time
          return (
            root.querySelector('main [dir="auto"]') ||
            root.querySelector('main') ||
            root.scrollingElement ||
            root.documentElement ||
            root.body
          );
        };

        const getMsgCount = () => root.querySelectorAll('[data-message-author-role]').length;

        const scroller = findScrollEl();
        if (!scroller) return;

        let lastH = -1;
        let lastCount = -1;
        let stableFor = 0;
        const deadline = Date.now() + DOM_STABLE_TIMEOUT;

        while (Date.now() < deadline) {
          // Scroll to bottom
          scroller.scrollTop = scroller.scrollHeight;
          // Nudge a bit more (some virtualized lists need a tick)
          await sleep(100);

          const h = scroller.scrollHeight;
          const c = getMsgCount();

          if (h === lastH && c === lastCount) {
            stableFor += DOM_STABLE_POLL_MS;
          } else {
            stableFor = 0;
          }

          lastH = h;
          lastCount = c;

          if (stableFor >= 1000) break; // ~1s unchanged -> consider stable
          await sleep(DOM_STABLE_POLL_MS);
        }
      };

      await scrollAndWait();

      const nodes = Array.from(doc.querySelectorAll('main [data-message-author-role]'));
      const msgs = nodes.map((el, i) => {
        const role = el.getAttribute('data-message-author-role') || 'unknown';

        // Prefer the main textual content region; fallbacks are safe but noisy
        let text = "";
        // Try common content wrappers first
        const contentEl =
          el.querySelector('[data-message-content="true"]') ||
          el.querySelector('[data-message-content]') ||
          el.querySelector('article') ||
          el.querySelector('[data-testid="conversation-turn"]') ||
          el;

        text = (contentEl.innerText || contentEl.textContent || "").trim();

        return { idx: i + 1, role, text };
      });

      return msgs;
    };

    // ---------- Platform-specific crawling ----------
    const conversations = [];

    if (platform === "openai") {
      log("🔎 ChatSaver Console — platform: openai — url:", location.href);

      // Collect visible conversation links from the left sidebar (current page only)
      const allLinks = Array.from(document.querySelectorAll('a[href^="/c/"]'));

      // Filter to unique conversation hrefs actually visible
      const seen = new Set();
      const targets = [];
      for (const a of allLinks) {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("/c/")) continue;
        const abs = getAbs(href);
        if (seen.has(abs)) continue;
        // Rough visibility check
        const rect = a.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        if (!isVisible) continue;

        seen.add(abs);
        // Title fallback strategy: sidebar usually repeats "ChatGPT" — acceptable for now
        const title = a.innerText?.trim() || "ChatGPT";
        targets.push({ title, url: abs });
      }

      log(`📚 Visible links discovered: ${targets.length}`);

      // Serialize: one iframe per conversation, awaited in order
      let idx = 0;
      for (const t of targets) {
        idx++;
        const { url } = t;
        let title = t.title || "ChatGPT";
        let error = "";

        log(`   ↳ [${idx - 1}] ${title} — loading…`);

        // Build hidden iframe (same-origin; ChatGPT allows it)
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.left = "-9999px";
        iframe.style.top = "-9999px";
        iframe.style.width = "800px";
        iframe.style.height = "600px";
        iframe.setAttribute("referrerpolicy", "origin-when-cross-origin"); // benign
        document.body.appendChild(iframe);

        let loaded = false;
        const timer = setTimeout(() => {
          if (!loaded) {
            error = "iframe load timeout";
            warn(`   ↳ [${idx - 1}] ERROR: ${error}`);
          }
        }, IFRAME_LOAD_TIMEOUT);

        try {
          iframe.src = url;
          await new Promise((resolve) => {
            iframe.onload = () => resolve();
          });
          loaded = true;
          clearTimeout(timer);

          const doc = iframe.contentDocument;
          if (!doc) throw new Error("no contentDocument");

          // Per-convo title (more specific than sidebar text)
          title = (
            doc.querySelector('[data-testid="conversation-name"]')?.textContent ||
            doc.title ||
            title
          ).trim();

          // Extract messages with auto-scroll + stabilization
          const messages = await extractMessagesFromDoc(doc);

          log(`   ↳ [${idx - 1}] ${title} — ${messages.length} msg(s)`);

          conversations.push({
            id: idx,
            title,
            url,
            convoMeta: { messageCount: messages.length },
            messages,
            ...(error ? { error } : {})
          });
        } catch (e) {
          clearTimeout(timer);
          error = (e && e.message) || String(e) || "unknown";
          err(`   ↳ [${idx - 1}] ERROR:`, error);
          conversations.push({
            id: idx,
            title,
            url,
            convoMeta: { messageCount: 0 },
            messages: [],
            error
          });
        } finally {
          iframe.remove();
          await sleep(50);
        }
      }

    } else if (platform === "grok") {
      log("🔎 ChatSaver Console — platform: grok — url:", location.href);
      // CSP blocks iframes; export only the current conversation
      const title = document.title || "Grok";
      const url = location.href;

      // Grok message bubbles (no stable author attr → mark as 'unknown' unless clear)
      const nodes = Array.from(document.querySelectorAll('.message-bubble, [data-author], .chat-message'));
      const messages = nodes.map((el, i) => {
        // Try to infer role if Grok exposes data-author; else unknown
        const raw = el.getAttribute?.('data-author') || "";
        const role =
          /user/i.test(raw) ? "user" :
          /assistant|grok/i.test(raw) ? "assistant" :
          "unknown";

        const text = (el.innerText || el.textContent || "").trim();
        return { idx: i + 1, role, text };
      }).filter(m => m.text);

      log(`📚 Grok current conversation messages: ${messages.length}`);

      conversations.push({
        id: 1,
        title,
        url,
        convoMeta: { messageCount: messages.length },
        messages
      });

    } else {
      err("Unsupported platform. Visit chatgpt.com or grok.com.");
      return;
    }

    // ---------- Export ----------
    const payload = { exportMeta, conversations };
    const fname = `chatsaver-${platform}-${scope}-${isoSafe(startedAt)}.json`;
    downloadJSON(payload, fname);

    // Console summary
    const summary = conversations.map(c => ({
      title: c.title,
      url: c.url,
      messages: c.convoMeta.messageCount,
      error: c.error || ""
    }));
    console.table(summary);
    log("📊", {
      platform,
      pageTitle: exportMeta.pageTitle,
      pageURL: exportMeta.pageURL,
      visibleLinks: platform === "openai" ? summary.length : undefined,
      scraped: summary.length,
      successes: summary.filter(s => !s.error).length,
      failures: summary.filter(s => s.error).length
    });
    log(`✅ Saved ${conversations.length} conversation(s) to ${fname}`);
  };

  // Run the async job (no stray awaits outside this call)
  run().catch(e => console.error("Fatal error:", e));
})();

