## 🗂️ ChatSaver

**ChatSaver** is a tiny, universal browser **bookmarklet** that exports your AI chat conversations — from **ChatGPT (chat.openai.com / chatgpt.com)** and **Grok (grok.com)** — directly to your clipboard and downloads them as **JSON** or **Markdown** files.

No extensions. No installs. Just click → export.

---

### ✨ Features

* ✅ Works on **ChatGPT (OpenAI)** and **Grok (xAI)**
* 📋 Exports chat history to **JSON** (structured) or **Markdown** (readable)
* 💾 Automatically downloads the exported file
* 📎 Copies the same content to clipboard
* 🌍 Multi-platform: automatically detects site
* 🔐 Local-only: runs entirely in your browser — no data leaves the page

---

### 🚀 Installation

1. Copy one of the bookmarklets below.
2. In your browser, create a **new bookmark** (any folder).
3. For the URL field, **paste the full code** from one of the sections below.
4. Name it something like:

   > `ChatSaver (Choose)`
5. Open a chat on ChatGPT or Grok, scroll up if needed to load all messages, and click the bookmark!

---

### 💾 Bookmarklet – JSON / Markdown Chooser

This version lets you choose between **JSON** and **Markdown** each time you click:

```javascript
javascript:(()=>{const norm=s=>(s||"").replace(/\s+/g," ").trim();const host=location.host;let msgs=[];const toMD=a=>a.map(x=>`## ${x.role.charAt(0).toUpperCase()+x.role.slice(1)}\n\n${x.text}\n`).join("\n");if(/chatgpt\.com|chat\.openai\.com/.test(host)){msgs=[...document.querySelectorAll('[data-message-author-role]')].map(d=>({role:d.getAttribute('data-message-author-role'),text:norm(d.innerText),timestamp:new Date().toISOString()}));}else if(host.includes('grok.com')||host.includes('x.com')||host.includes('grok.x.ai')){const guessRole=b=>{const c=b.classList,has=t=>[...c].some(x=>x.includes(t));return has('bg-surface')||has('border-border')||c.contains('rounded-br-lg')?'user':(c.contains('w-full')&&c.contains('max-w-none'))?'assistant':'assistant'};msgs=[...document.querySelectorAll('.message-bubble')].map(b=>{const t=b.querySelector('.response-content-markdown.markdown')||b;return{role:guessRole(b),text:norm(t.innerText),timestamp:new Date().toISOString()}}).filter(x=>x.text);}else{alert(`Unsupported platform: ${host}`);return;}if(!msgs.length){alert('No messages found. Scroll to load older messages and try again.');return;}const choice=(prompt('Export format? Type JSON or MD','JSON')||'').trim().toUpperCase();if(!choice)return;const stamp=new Date().toISOString().replace(/:/g,'-');const plat=/openai|chatgpt/.test(host)?'openai':'grok';let content,filename,mime;if(choice==='MD'){content=toMD(msgs);filename=`${stamp}-${plat}.md`;mime='text/markdown'}else{content=JSON.stringify(msgs,null,2);filename=`${stamp}-${plat}.json`;mime='application/json'}const save=(c,fn,ty)=>{const bl=new Blob([c],{type:ty}),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=fn;document.body.appendChild(a);a.click();a.remove()};(async()=>{try{await navigator.clipboard.writeText(content)}catch(e){}save(content,filename,mime);alert(`✅ Exported ${msgs.length} messages → ${filename}`)})()})();
```

---

### 💾 Bookmarklet – JSON Only (simpler)

If you prefer an instant export with no prompt:

```javascript
javascript:(()=>{const N=s=>(s||"").replace(/\s+/g," ").trim();const H=location.host;let M=[];if(/chatgpt\.com|chat\.openai\.com/.test(H)){M=[...document.querySelectorAll('[data-message-author-role]')].map(d=>({role:d.getAttribute('data-message-author-role'),text:N(d.innerText),timestamp:new Date().toISOString()}));}else if(H.includes('grok.com')||H.includes('x.com')||H.includes('grok.x.ai')){const R=b=>{const c=b.classList,has=t=>[...c].some(x=>x.includes(t));if(has('bg-surface')||has('border-border')||c.contains('rounded-br-lg'))return'user';if(c.contains('w-full')&&c.contains('max-w-none'))return'assistant';return'assistant'};M=[...document.querySelectorAll('.message-bubble')].map(b=>{const t=b.querySelector('.response-content-markdown.markdown')||b;return{role:R(b),text:N(t.innerText),timestamp:new Date().toISOString()}}).filter(x=>x.text);}else{alert(`Unsupported platform: ${H}`);return;}if(!M.length){alert('No messages found. Scroll to load older messages and try again.');return;}const J=JSON.stringify(M,null,2),save=(c,fn)=>{const bl=new Blob([c],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=fn;document.body.appendChild(a);a.click();a.remove();};const stamp=new Date().toISOString().replace(/:/g,'-');const plat=/openai|chatgpt/.test(H)?'openai':'grok';const fn=`${stamp}-${plat}.json`;(()=>{try{navigator.clipboard.writeText(J)}catch(e){}save(J,fn);alert(`✅ Exported ${M.length} messages → ${fn}`)})()})();
```

### 3. Save All Bookmarklet (Multi-Convo Export)
For bulk-exporting multiple conversations at once (OpenAI sidebar) or the current session (Grok), use this advanced bookmarklet. It auto-detects the platform: supports both grok.com and chatgpt.com, but multiple conversation support only works on OpenAI (via hidden iframes for visible sidebar chats). Grok exports only the current conversation due to CSP restrictions—no multi-convo there.

**Note**: Depending on how many conversations are loaded into the current page (e.g., a long OpenAI sidebar), this may take a while—up to 30 seconds per convo for loading and extraction. Watch progress via the browser console (F12 to open, or Shift+Ctrl+K on Firefox).

1. Create a new bookmark.
2. Paste the code below into the URL field.
3. Name it "ChatSaver All".
4. On ChatGPT (for multi) or Grok (single), click the bookmark—progress logs in console; JSON downloads automatically.

#### Full Multi-Convo Bookmarklet
```
javascript:(function()%7B(()%20%3D%3E%20%7B%0A%20%20%2F%2F%20One-shot%20async%20runner%20(prevents%20stray%20top-level%20await)%0A%20%20const%20run%20%3D%20async%20()%20%3D%3E%20%7B%0A%20%20%20%20const%20startedAt%20%3D%20new%20Date()%3B%0A%20%20%20%20const%20isoSafe%20%3D%20(d%20%3D%20new%20Date())%20%3D%3E%0A%20%20%20%20%20%20d.toISOString().replace(%2F%3A%2Fg%2C%20%22-%22)%3B%0A%0A%20%20%20%20const%20platform%20%3D%0A%20%20%20%20%20%20%2Fchatgpt%5C.com%24%2Fi.test(location.host)%20%3F%20%22openai%22%20%3A%0A%20%20%20%20%20%20%2Fgrok%5C.com%24%2Fi.test(location.host)%20%20%20%20%3F%20%22grok%22%20%20%20%3A%0A%20%20%20%20%20%20%22unknown%22%3B%0A%0A%20%20%20%20const%20scope%20%3D%20platform%20%3D%3D%3D%20%22grok%22%20%3F%20%22CURRENT%22%20%3A%20%22VISIBLE%22%3B%0A%0A%20%20%20%20%2F%2F%20Snapshot%20file-level%20meta%20BEFORE%20any%20navigation%20%2F%20iframe%20loads%0A%20%20%20%20const%20exportMeta%20%3D%20%7B%0A%20%20%20%20%20%20exportedAt%3A%20new%20Date().toISOString()%2C%0A%20%20%20%20%20%20platform%2C%0A%20%20%20%20%20%20pageTitle%3A%20document.title%2C%0A%20%20%20%20%20%20pageURL%3A%20location.href%2C%0A%20%20%20%20%20%20scope%2C%0A%20%20%20%20%20%20format%3A%20%22JSON%22%2C%0A%20%20%20%20%20%20version%3A%20%221%22%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20const%20log%20%3D%20(...args)%20%3D%3E%20console.log(...args)%3B%0A%20%20%20%20const%20warn%20%3D%20(...args)%20%3D%3E%20console.warn(...args)%3B%0A%20%20%20%20const%20err%20%20%3D%20(...args)%20%3D%3E%20console.error(...args)%3B%0A%0A%20%20%20%20const%20sleep%20%3D%20(ms)%20%3D%3E%20new%20Promise(r%20%3D%3E%20setTimeout(r%2C%20ms))%3B%0A%0A%20%20%20%20const%20IFRAME_LOAD_TIMEOUT%20%3D%2030000%3B%20%20%20%2F%2F%2030s%20per%20convo%20load%0A%20%20%20%20const%20DOM_STABLE_TIMEOUT%20%20%3D%2025000%3B%20%20%20%2F%2F%2025s%20to%20finish%20autoscroll%2Fmaterialization%0A%20%20%20%20const%20DOM_STABLE_POLL_MS%20%20%3D%20500%3B%0A%0A%20%20%20%20const%20getAbs%20%3D%20(href)%20%3D%3E%20%7B%0A%20%20%20%20%20%20try%20%7B%20return%20new%20URL(href%2C%20location.origin).href%3B%20%7D%0A%20%20%20%20%20%20catch%20%7B%20return%20href%3B%20%7D%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20const%20downloadJSON%20%3D%20(obj%2C%20fname)%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20blob%20%3D%20new%20Blob(%5BJSON.stringify(obj%2C%20null%2C%202)%5D%2C%20%7B%20type%3A%20%22application%2Fjson%22%20%7D)%3B%0A%20%20%20%20%20%20const%20a%20%3D%20document.createElement(%22a%22)%3B%0A%20%20%20%20%20%20a.href%20%3D%20URL.createObjectURL(blob)%3B%0A%20%20%20%20%20%20a.download%20%3D%20fname%3B%0A%20%20%20%20%20%20document.body.appendChild(a)%3B%0A%20%20%20%20%20%20a.click()%3B%0A%20%20%20%20%20%20setTimeout(()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20URL.revokeObjectURL(a.href)%3B%0A%20%20%20%20%20%20%20%20a.remove()%3B%0A%20%20%20%20%20%20%7D%2C%200)%3B%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20%2F%2F%20----------%20Message%20extraction%20helpers%20----------%0A%20%20%20%20const%20extractMessagesFromDoc%20%3D%20async%20(doc)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%2F%2F%20Auto-scroll%20container%20and%20wait%20for%20stabilization%0A%20%20%20%20%20%20const%20scrollAndWait%20%3D%20async%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20const%20root%20%3D%20doc%3B%0A%20%20%20%20%20%20%20%20const%20findScrollEl%20%3D%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Try%20the%20main%20chat%20scroller%20variants%20used%20over%20time%0A%20%20%20%20%20%20%20%20%20%20return%20(%0A%20%20%20%20%20%20%20%20%20%20%20%20root.querySelector('main%20%5Bdir%3D%22auto%22%5D')%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20root.querySelector('main')%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20root.scrollingElement%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20root.documentElement%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20root.body%0A%20%20%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%20%20%20%20%7D%3B%0A%0A%20%20%20%20%20%20%20%20const%20getMsgCount%20%3D%20()%20%3D%3E%20root.querySelectorAll('%5Bdata-message-author-role%5D').length%3B%0A%0A%20%20%20%20%20%20%20%20const%20scroller%20%3D%20findScrollEl()%3B%0A%20%20%20%20%20%20%20%20if%20(!scroller)%20return%3B%0A%0A%20%20%20%20%20%20%20%20let%20lastH%20%3D%20-1%3B%0A%20%20%20%20%20%20%20%20let%20lastCount%20%3D%20-1%3B%0A%20%20%20%20%20%20%20%20let%20stableFor%20%3D%200%3B%0A%20%20%20%20%20%20%20%20const%20deadline%20%3D%20Date.now()%20%2B%20DOM_STABLE_TIMEOUT%3B%0A%0A%20%20%20%20%20%20%20%20while%20(Date.now()%20%3C%20deadline)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Scroll%20to%20bottom%0A%20%20%20%20%20%20%20%20%20%20scroller.scrollTop%20%3D%20scroller.scrollHeight%3B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Nudge%20a%20bit%20more%20(some%20virtualized%20lists%20need%20a%20tick)%0A%20%20%20%20%20%20%20%20%20%20await%20sleep(100)%3B%0A%0A%20%20%20%20%20%20%20%20%20%20const%20h%20%3D%20scroller.scrollHeight%3B%0A%20%20%20%20%20%20%20%20%20%20const%20c%20%3D%20getMsgCount()%3B%0A%0A%20%20%20%20%20%20%20%20%20%20if%20(h%20%3D%3D%3D%20lastH%20%26%26%20c%20%3D%3D%3D%20lastCount)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20stableFor%20%2B%3D%20DOM_STABLE_POLL_MS%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20stableFor%20%3D%200%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%20%20%20%20lastH%20%3D%20h%3B%0A%20%20%20%20%20%20%20%20%20%20lastCount%20%3D%20c%3B%0A%0A%20%20%20%20%20%20%20%20%20%20if%20(stableFor%20%3E%3D%201000)%20break%3B%20%2F%2F%20~1s%20unchanged%20-%3E%20consider%20stable%0A%20%20%20%20%20%20%20%20%20%20await%20sleep(DOM_STABLE_POLL_MS)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%3B%0A%0A%20%20%20%20%20%20await%20scrollAndWait()%3B%0A%0A%20%20%20%20%20%20const%20nodes%20%3D%20Array.from(doc.querySelectorAll('main%20%5Bdata-message-author-role%5D'))%3B%0A%20%20%20%20%20%20const%20msgs%20%3D%20nodes.map((el%2C%20i)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20const%20role%20%3D%20el.getAttribute('data-message-author-role')%20%7C%7C%20'unknown'%3B%0A%0A%20%20%20%20%20%20%20%20%2F%2F%20Prefer%20the%20main%20textual%20content%20region%3B%20fallbacks%20are%20safe%20but%20noisy%0A%20%20%20%20%20%20%20%20let%20text%20%3D%20%22%22%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20Try%20common%20content%20wrappers%20first%0A%20%20%20%20%20%20%20%20const%20contentEl%20%3D%0A%20%20%20%20%20%20%20%20%20%20el.querySelector('%5Bdata-message-content%3D%22true%22%5D')%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20el.querySelector('%5Bdata-message-content%5D')%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20el.querySelector('article')%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20el.querySelector('%5Bdata-testid%3D%22conversation-turn%22%5D')%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20el%3B%0A%0A%20%20%20%20%20%20%20%20text%20%3D%20(contentEl.innerText%20%7C%7C%20contentEl.textContent%20%7C%7C%20%22%22).trim()%3B%0A%0A%20%20%20%20%20%20%20%20return%20%7B%20idx%3A%20i%20%2B%201%2C%20role%2C%20text%20%7D%3B%0A%20%20%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%20%20return%20msgs%3B%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20%2F%2F%20----------%20Platform-specific%20crawling%20----------%0A%20%20%20%20const%20conversations%20%3D%20%5B%5D%3B%0A%0A%20%20%20%20if%20(platform%20%3D%3D%3D%20%22openai%22)%20%7B%0A%20%20%20%20%20%20log(%22%F0%9F%94%8E%20ChatSaver%20Console%20%E2%80%94%20platform%3A%20openai%20%E2%80%94%20url%3A%22%2C%20location.href)%3B%0A%0A%20%20%20%20%20%20%2F%2F%20Collect%20visible%20conversation%20links%20from%20the%20left%20sidebar%20(current%20page%20only)%0A%20%20%20%20%20%20const%20allLinks%20%3D%20Array.from(document.querySelectorAll('a%5Bhref%5E%3D%22%2Fc%2F%22%5D'))%3B%0A%0A%20%20%20%20%20%20%2F%2F%20Filter%20to%20unique%20conversation%20hrefs%20actually%20visible%0A%20%20%20%20%20%20const%20seen%20%3D%20new%20Set()%3B%0A%20%20%20%20%20%20const%20targets%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20for%20(const%20a%20of%20allLinks)%20%7B%0A%20%20%20%20%20%20%20%20const%20href%20%3D%20a.getAttribute(%22href%22)%20%7C%7C%20%22%22%3B%0A%20%20%20%20%20%20%20%20if%20(!href.startsWith(%22%2Fc%2F%22))%20continue%3B%0A%20%20%20%20%20%20%20%20const%20abs%20%3D%20getAbs(href)%3B%0A%20%20%20%20%20%20%20%20if%20(seen.has(abs))%20continue%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20Rough%20visibility%20check%0A%20%20%20%20%20%20%20%20const%20rect%20%3D%20a.getBoundingClientRect()%3B%0A%20%20%20%20%20%20%20%20const%20isVisible%20%3D%20rect.width%20%3E%200%20%26%26%20rect.height%20%3E%200%3B%0A%20%20%20%20%20%20%20%20if%20(!isVisible)%20continue%3B%0A%0A%20%20%20%20%20%20%20%20seen.add(abs)%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20Title%20fallback%20strategy%3A%20sidebar%20usually%20repeats%20%22ChatGPT%22%20%E2%80%94%20acceptable%20for%20now%0A%20%20%20%20%20%20%20%20const%20title%20%3D%20a.innerText%3F.trim()%20%7C%7C%20%22ChatGPT%22%3B%0A%20%20%20%20%20%20%20%20targets.push(%7B%20title%2C%20url%3A%20abs%20%7D)%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20log(%60%F0%9F%93%9A%20Visible%20links%20discovered%3A%20%24%7Btargets.length%7D%60)%3B%0A%0A%20%20%20%20%20%20%2F%2F%20Serialize%3A%20one%20iframe%20per%20conversation%2C%20awaited%20in%20order%0A%20%20%20%20%20%20let%20idx%20%3D%200%3B%0A%20%20%20%20%20%20for%20(const%20t%20of%20targets)%20%7B%0A%20%20%20%20%20%20%20%20idx%2B%2B%3B%0A%20%20%20%20%20%20%20%20const%20%7B%20url%20%7D%20%3D%20t%3B%0A%20%20%20%20%20%20%20%20let%20title%20%3D%20t.title%20%7C%7C%20%22ChatGPT%22%3B%0A%20%20%20%20%20%20%20%20let%20error%20%3D%20%22%22%3B%0A%0A%20%20%20%20%20%20%20%20log(%60%20%20%20%E2%86%B3%20%5B%24%7Bidx%20-%201%7D%5D%20%24%7Btitle%7D%20%E2%80%94%20loading%E2%80%A6%60)%3B%0A%0A%20%20%20%20%20%20%20%20%2F%2F%20Build%20hidden%20iframe%20(same-origin%3B%20ChatGPT%20allows%20it)%0A%20%20%20%20%20%20%20%20const%20iframe%20%3D%20document.createElement(%22iframe%22)%3B%0A%20%20%20%20%20%20%20%20iframe.style.position%20%3D%20%22fixed%22%3B%0A%20%20%20%20%20%20%20%20iframe.style.left%20%3D%20%22-9999px%22%3B%0A%20%20%20%20%20%20%20%20iframe.style.top%20%3D%20%22-9999px%22%3B%0A%20%20%20%20%20%20%20%20iframe.style.width%20%3D%20%22800px%22%3B%0A%20%20%20%20%20%20%20%20iframe.style.height%20%3D%20%22600px%22%3B%0A%20%20%20%20%20%20%20%20iframe.setAttribute(%22referrerpolicy%22%2C%20%22origin-when-cross-origin%22)%3B%20%2F%2F%20benign%0A%20%20%20%20%20%20%20%20document.body.appendChild(iframe)%3B%0A%0A%20%20%20%20%20%20%20%20let%20loaded%20%3D%20false%3B%0A%20%20%20%20%20%20%20%20const%20timer%20%3D%20setTimeout(()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20if%20(!loaded)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20error%20%3D%20%22iframe%20load%20timeout%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20warn(%60%20%20%20%E2%86%B3%20%5B%24%7Bidx%20-%201%7D%5D%20ERROR%3A%20%24%7Berror%7D%60)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%2C%20IFRAME_LOAD_TIMEOUT)%3B%0A%0A%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20iframe.src%20%3D%20url%3B%0A%20%20%20%20%20%20%20%20%20%20await%20new%20Promise((resolve)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20iframe.onload%20%3D%20()%20%3D%3E%20resolve()%3B%0A%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20loaded%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20clearTimeout(timer)%3B%0A%0A%20%20%20%20%20%20%20%20%20%20const%20doc%20%3D%20iframe.contentDocument%3B%0A%20%20%20%20%20%20%20%20%20%20if%20(!doc)%20throw%20new%20Error(%22no%20contentDocument%22)%3B%0A%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Per-convo%20title%20(more%20specific%20than%20sidebar%20text)%0A%20%20%20%20%20%20%20%20%20%20title%20%3D%20(%0A%20%20%20%20%20%20%20%20%20%20%20%20doc.querySelector('%5Bdata-testid%3D%22conversation-name%22%5D')%3F.textContent%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20doc.title%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20%20%20).trim()%3B%0A%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Extract%20messages%20with%20auto-scroll%20%2B%20stabilization%0A%20%20%20%20%20%20%20%20%20%20const%20messages%20%3D%20await%20extractMessagesFromDoc(doc)%3B%0A%0A%20%20%20%20%20%20%20%20%20%20log(%60%20%20%20%E2%86%B3%20%5B%24%7Bidx%20-%201%7D%5D%20%24%7Btitle%7D%20%E2%80%94%20%24%7Bmessages.length%7D%20msg(s)%60)%3B%0A%0A%20%20%20%20%20%20%20%20%20%20conversations.push(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20idx%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20title%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20url%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20convoMeta%3A%20%7B%20messageCount%3A%20messages.length%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20messages%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20...(error%20%3F%20%7B%20error%20%7D%20%3A%20%7B%7D)%0A%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20clearTimeout(timer)%3B%0A%20%20%20%20%20%20%20%20%20%20error%20%3D%20(e%20%26%26%20e.message)%20%7C%7C%20String(e)%20%7C%7C%20%22unknown%22%3B%0A%20%20%20%20%20%20%20%20%20%20err(%60%20%20%20%E2%86%B3%20%5B%24%7Bidx%20-%201%7D%5D%20ERROR%3A%60%2C%20error)%3B%0A%20%20%20%20%20%20%20%20%20%20conversations.push(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20idx%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20title%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20url%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20convoMeta%3A%20%7B%20messageCount%3A%200%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20messages%3A%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20error%0A%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%7D%20finally%20%7B%0A%20%20%20%20%20%20%20%20%20%20iframe.remove()%3B%0A%20%20%20%20%20%20%20%20%20%20await%20sleep(50)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%7D%20else%20if%20(platform%20%3D%3D%3D%20%22grok%22)%20%7B%0A%20%20%20%20%20%20log(%22%F0%9F%94%8E%20ChatSaver%20Console%20%E2%80%94%20platform%3A%20grok%20%E2%80%94%20url%3A%22%2C%20location.href)%3B%0A%20%20%20%20%20%20%2F%2F%20CSP%20blocks%20iframes%3B%20export%20only%20the%20current%20conversation%0A%20%20%20%20%20%20const%20title%20%3D%20document.title%20%7C%7C%20%22Grok%22%3B%0A%20%20%20%20%20%20const%20url%20%3D%20location.href%3B%0A%0A%20%20%20%20%20%20%2F%2F%20Grok%20message%20bubbles%20(no%20stable%20author%20attr%20%E2%86%92%20mark%20as%20'unknown'%20unless%20clear)%0A%20%20%20%20%20%20const%20nodes%20%3D%20Array.from(document.querySelectorAll('.message-bubble%2C%20%5Bdata-author%5D%2C%20.chat-message'))%3B%0A%20%20%20%20%20%20const%20messages%20%3D%20nodes.map((el%2C%20i)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20Try%20to%20infer%20role%20if%20Grok%20exposes%20data-author%3B%20else%20unknown%0A%20%20%20%20%20%20%20%20const%20raw%20%3D%20el.getAttribute%3F.('data-author')%20%7C%7C%20%22%22%3B%0A%20%20%20%20%20%20%20%20const%20role%20%3D%0A%20%20%20%20%20%20%20%20%20%20%2Fuser%2Fi.test(raw)%20%3F%20%22user%22%20%3A%0A%20%20%20%20%20%20%20%20%20%20%2Fassistant%7Cgrok%2Fi.test(raw)%20%3F%20%22assistant%22%20%3A%0A%20%20%20%20%20%20%20%20%20%20%22unknown%22%3B%0A%0A%20%20%20%20%20%20%20%20const%20text%20%3D%20(el.innerText%20%7C%7C%20el.textContent%20%7C%7C%20%22%22).trim()%3B%0A%20%20%20%20%20%20%20%20return%20%7B%20idx%3A%20i%20%2B%201%2C%20role%2C%20text%20%7D%3B%0A%20%20%20%20%20%20%7D).filter(m%20%3D%3E%20m.text)%3B%0A%0A%20%20%20%20%20%20log(%60%F0%9F%93%9A%20Grok%20current%20conversation%20messages%3A%20%24%7Bmessages.length%7D%60)%3B%0A%0A%20%20%20%20%20%20conversations.push(%7B%0A%20%20%20%20%20%20%20%20id%3A%201%2C%0A%20%20%20%20%20%20%20%20title%2C%0A%20%20%20%20%20%20%20%20url%2C%0A%20%20%20%20%20%20%20%20convoMeta%3A%20%7B%20messageCount%3A%20messages.length%20%7D%2C%0A%20%20%20%20%20%20%20%20messages%0A%20%20%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20err(%22Unsupported%20platform.%20Visit%20chatgpt.com%20or%20grok.com.%22)%3B%0A%20%20%20%20%20%20return%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20----------%20Export%20----------%0A%20%20%20%20const%20payload%20%3D%20%7B%20exportMeta%2C%20conversations%20%7D%3B%0A%20%20%20%20const%20fname%20%3D%20%60chatsaver-%24%7Bplatform%7D-%24%7Bscope%7D-%24%7BisoSafe(startedAt)%7D.json%60%3B%0A%20%20%20%20downloadJSON(payload%2C%20fname)%3B%0A%0A%20%20%20%20%2F%2F%20Console%20summary%0A%20%20%20%20const%20summary%20%3D%20conversations.map(c%20%3D%3E%20(%7B%0A%20%20%20%20%20%20title%3A%20c.title%2C%0A%20%20%20%20%20%20url%3A%20c.url%2C%0A%20%20%20%20%20%20messages%3A%20c.convoMeta.messageCount%2C%0A%20%20%20%20%20%20error%3A%20c.error%20%7C%7C%20%22%22%0A%20%20%20%20%7D))%3B%0A%20%20%20%20console.table(summary)%3B%0A%20%20%20%20log(%22%F0%9F%93%8A%22%2C%20%7B%0A%20%20%20%20%20%20platform%2C%0A%20%20%20%20%20%20pageTitle%3A%20exportMeta.pageTitle%2C%0A%20%20%20%20%20%20pageURL%3A%20exportMeta.pageURL%2C%0A%20%20%20%20%20%20visibleLinks%3A%20platform%20%3D%3D%3D%20%22openai%22%20%3F%20summary.length%20%3A%20undefined%2C%0A%20%20%20%20%20%20scraped%3A%20summary.length%2C%0A%20%20%20%20%20%20successes%3A%20summary.filter(s%20%3D%3E%20!s.error).length%2C%0A%20%20%20%20%20%20failures%3A%20summary.filter(s%20%3D%3E%20s.error).length%0A%20%20%20%20%7D)%3B%0A%20%20%20%20log(%60%E2%9C%85%20Saved%20%24%7Bconversations.length%7D%20conversation(s)%20to%20%24%7Bfname%7D%60)%3B%0A%20%20%7D%3B%0A%0A%20%20%2F%2F%20Run%20the%20async%20job%20(no%20stray%20awaits%20outside%20this%20call)%0A%20%20run().catch(e%20%3D%3E%20console.error(%22Fatal%20error%3A%22%2C%20e))%3B%0A%7D)()%3B%7D)()%3B
```

#### JSON Output Format Overview
The exported file is a pretty-printed JSON with top-level metadata and an array of conversations. Each convo includes title/URL, message count, and an ordered list of messages (with index, role, and trimmed text). Errors (e.g., load timeouts) are noted per convo without halting the run.

Example structure:
```json
{
  "exportMeta": {
    "exportedAt": "2025-10-08T12:00:00.000Z",
    "platform": "openai",
    "pageTitle": "ChatGPT",
    "pageURL": "https://chatgpt.com/...",
    "scope": "VISIBLE",
    "format": "JSON",
    "version": "1"
  },
  "conversations": [
    {
      "id": 1,
      "title": "My Epic Thread",
      "url": "https://chatgpt.com/c/abc123",
      "convoMeta": { "messageCount": 42 },
      "messages": [
        { "idx": 1, "role": "user", "text": "Hello, world!" },
        { "idx": 2, "role": "assistant", "text": "Hi there! How can I help?" }
      ],
      "error": ""  // Empty if successful; e.g., "iframe load timeout" otherwise
    }
  ]
}
```

---

### 🧠 Usage

1. Navigate to your chat (ChatGPT or Grok).
2. Scroll up to ensure all messages you want exported are visible.
3. Click your **ChatSaver** bookmark.
4. Choose `JSON` or `MD` (for Markdown).
5. The data is:

   * Copied to your clipboard.
   * Downloaded automatically.

---

### 📁 Output Examples

#### JSON

```json
[
  {
    "role": "user",
    "text": "How can I export my chat?",
    "timestamp": "2025-10-05T20:45:00.000Z"
  },
  {
    "role": "assistant",
    "text": "You can use the ChatSaver bookmarklet!",
    "timestamp": "2025-10-05T20:45:03.000Z"
  }
]
```

#### Markdown

```
## User

How can I export my chat?

## Assistant

You can use the ChatSaver bookmarklet!
```

---

### 🧩 Roadmap
* [ ] Basic UX with search OR load into open-webui backend
* [ ] Detect **conversation titles** for file naming
* [ ] Iterate through all currently loaded conversations?

---

### ⚙️ Tech Notes

* 100% client-side (no external requests).
* Works in any Chromium-based or Firefox browser.
* Uses `Blob` download and Clipboard API for export.
* Gracefully falls back if clipboard permission denied.
* Use [bookmarklet-maker](https://github.com/caiorss/bookmarklet-maker)
---

### 🧑‍💻 Credits
Inspired by the need for simple, transparent, no-login chat exporting.

