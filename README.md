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

