#!/usr/bin/env python3
"""
解析 Google Docs HTML 匯出，切割成教材章節檔案
用法: python3 scripts/parse_tutorial.py
"""

import re
import json
import os
import shutil
from urllib.parse import urlparse, parse_qs, unquote

HTML_FILE   = "Google Sheets 操作手冊 (2025)/Google Sheets 操作手冊 (2025).html"
IMAGES_SRC  = "Google Sheets 操作手冊 (2025)/images"
OUTPUT_DIR  = "content/tutorial"
IMAGES_DEST = "public/tutorial/images"

# 要解析的章節（Chapter N）
CHAPTERS_TO_PARSE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

FORMULA_COLORS = {
    'f7981d': 'f-c1',
    '7e3794': 'f-c2',
    '11a9cc': 'f-c3',
    '008000': 'f-c4',
    'a61d4c': 'f-c5',
    '4285f4': 'f-c6',
    'f4b400': 'f-c7',
    '188038': 'f-c8',
    'b75e00': 'f-c9',
}

# ── 工具函式 ──────────────────────────────────────────────��────

def real_url(google_url: str) -> str:
    try:
        if "google.com/url" in google_url:
            params = parse_qs(urlparse(google_url).query)
            target = params.get("q", [None])[0]
            if target:
                return unquote(target)
    except Exception:
        pass
    return google_url

def youtube_id(url: str):
    url = real_url(url)
    if "youtu.be/" in url:
        vid = url.split("youtu.be/")[-1].split("?")[0].split("&")[0]
        return vid if vid else None
    if "youtube.com/watch" in url:
        params = parse_qs(urlparse(url).query)
        return params.get("v", [None])[0]
    return None

def clean_content(html: str, bold_classes: list, italic_classes: list,
                  formula_color_classes: dict = None) -> str:
    # ① 公式顏色 span → placeholder（保留同 span 上的粗體）
    placeholders = {}
    if formula_color_classes:
        bold_set = set(bold_classes)
        for cls, semantic in formula_color_classes.items():
            open_ph  = f'__FCOPEN_{semantic}__'
            close_ph = f'__FCCLOSE_{semantic}__'
            placeholders[semantic] = (open_ph, close_ph)

            def replace_span(m, op=open_ph, cp=close_ph):
                full_tag = m.group(0)
                content = m.group(1)
                class_m = re.search(r'class="([^"]*)"', full_tag)
                classes = class_m.group(1).split() if class_m else []
                if any(b in classes for b in bold_set):
                    return f'<strong>{op}{content}{cp}</strong>'
                return f'{op}{content}{cp}'

            html = re.sub(
                rf'<span[^>]*\bclass="[^"]*\b{cls}\b[^"]*"[^>]*>(.*?)</span>',
                replace_span,
                html, flags=re.DOTALL
            )

    # ② 粗體 / 斜體
    for cls in bold_classes:
        html = re.sub(
            rf'<span[^>]*\bclass="[^"]*\b{cls}\b[^"]*"[^>]*>(.*?)</span>',
            r"<strong>\1</strong>", html, flags=re.DOTALL
        )
    for cls in italic_classes:
        html = re.sub(
            rf'<span[^>]*\bclass="[^"]*\b{cls}\b[^"]*"[^>]*>(.*?)</span>',
            r"<em>\1</em>", html, flags=re.DOTALL
        )

    # ③ 剩餘 span 展開
    html = re.sub(r"<span[^>]*>(.*?)</span>", r"\1", html, flags=re.DOTALL)

    # ④ placeholder 還原
    for semantic, (open_ph, close_ph) in placeholders.items():
        html = html.replace(open_ph,  f'<span class="{semantic}">')
        html = html.replace(close_ph, '</span>')

    # ⑤ 巢狀清單（lst-kix_...-N > 0）— 同時處理 <ul> 和 <ol>
    def mark_list_level(m):
        tag = m.group(0)
        cls_m = re.search(r'class="([^"]*)"', tag)
        if cls_m:
            level_m = re.search(r'lst-kix_\w+-(\d+)', cls_m.group(1))
            if level_m and int(level_m.group(1)) > 0:
                tag = re.sub(r'<(ul|ol)\b', r'<\1 class="nested-ol"', tag, count=1)
        return tag
    html = re.sub(r'<(?:ul|ol)[^>]*>', mark_list_level, html)

    # ⑤b 把 nested-ol 移到前一個 </li> 內（修正 HTML 結構）
    def _fix_nested(h):
        pat = (r'(</li>)'
               r'(\s*</(?:ul|ol)>)'
               r'(\s*<(?:ul|ol)[^>]*\bclass="nested-ol"[^>]*>.*?</(?:ul|ol)>)')
        for _ in range(8):
            new = re.sub(pat, r'\3\1\2', h, flags=re.DOTALL)
            if new == h:
                break
            h = new
        return h
    html = _fix_nested(html)

    # ⑥ 公式表格 / 比較表頭
    html = re.sub(
        r'<table([^>]*)\bclass="([^"]*)\bc9\b([^"]*)"([^>]*)>',
        r'<table\1class="formula-table"\4>', html
    )
    html = re.sub(
        r'<td([^>]*)\bclass="([^"]*)\bc37\b([^"]*)"([^>]*)>',
        r'<td\1class="td-header"\4>', html
    )

    # ⑦ 清除 style / class / id（保留語意 class）
    html = re.sub(r'\s+style=".*?"', "", html, flags=re.DOTALL)
    html = re.sub(r'\s+class="(?!chapter-callout|f-c|formula-table|td-header|nested-ol)[^"]*"', "", html)
    html = re.sub(r'\s+id="[^"]*"', "", html)

    html = re.sub(r'src="images/', 'src="/tutorial/images/', html)
    def fix_link(m):
        return f'href="{real_url(m.group(1))}"'
    html = re.sub(r'href="(https?://[^"]+)"', fix_link, html)
    html = re.sub(r"<p>\s*(&nbsp;)?\s*</p>", "", html)
    html = re.sub(r"\n{3,}", "\n\n", html)

    # ⑧ 本章完成檔案 → chapter-callout（處理多種 HR 位置）
    html = re.sub(
        r'(?:<hr>)?\s*<p>(?:<strong>[^<]*</strong>\s*)?(<a\b[^>]+>[^<]*&#23436;&#25104;&#29256;[^<]*</a>)[^<]*(?:<hr>)?\s*</p>(?:\s*<hr>)?',
        r'<div class="chapter-callout"><strong>&#26412;&#31456;&#23436;&#25104;&#27284;&#26696;&#65306;</strong>\1</div>',
        html, flags=re.DOTALL
    )

    # ⑨ 合併相鄰 formula-table（PDF 分頁導致的斷表）
    html = re.sub(
        r'</table>\s*(?:<hr>)?\s*(?:<p>\s*(?:<strong>)?\s*(?:</strong>)?\s*</p>\s*)?(?:<hr>)?\s*<table([^>]*\bclass="[^"]*formula-table[^"]*"[^>]*)>',
        '',
        html, flags=re.DOTALL
    )

    return html.strip()

def extract_video_from_heading(h_html: str):
    for href in re.findall(r'href="([^"]+)"', h_html):
        vid = youtube_id(href)
        if vid:
            return vid
    return None

def clean_title(h_html: str) -> str:
    import html as htmllib
    text = htmllib.unescape(re.sub(r"<[^>]+>", "", h_html))
    text = re.sub(r"\s*影片\s*(Link\s*(\([上下]\))?(\s*/\s*Link\s*(\([上下]\))?)*)?", "", text)
    return text.strip()

def make_slug(title: str, ch_num: int):
    """從標題產生 slug，支援 X.Y 和 Appendix X"""
    m = re.match(r"(\d+)\.(\d+)", title)
    if m:
        return f"{m.group(1)}-{m.group(2)}"
    m_app = re.match(r"Appendix\s+(\d+)", title, re.IGNORECASE)
    if m_app:
        return f"{m_app.group(1)}-appendix"
    return None

def parse_chapter(full_html: str, ch_num: int, bold_classes, italic_classes,
                  formula_color_classes, h1_matches, h1_titles):
    ch_idx = next((i for i, t in enumerate(h1_titles) if f"Chapter {ch_num}" in t), None)
    if ch_idx is None:
        print(f"  ⚠️  找不到 Chapter {ch_num}")
        return None

    ch_start = h1_matches[ch_idx].start()
    ch_end   = h1_matches[ch_idx + 1].start() if ch_idx + 1 < len(h1_matches) else len(full_html)
    ch_html  = full_html[ch_start:ch_end]

    ch_h1    = re.search(r"<h1[^>]*>(.*?)</h1>", ch_html, re.DOTALL)
    ch_title = clean_title(ch_h1.group(1))
    ch_video = extract_video_from_heading(ch_h1.group(0))

    h2_matches = list(re.finditer(r"<h2[^>]*>(.*?)</h2>", ch_html, re.DOTALL))
    intro_end  = h2_matches[0].start() if h2_matches else len(ch_html)
    intro_raw  = ch_html[ch_h1.end():intro_end]
    intro_raw  = re.sub(
        r'<p[^>]*\bsubtitle\b[^>]*>(.*?)</p>',
        r'<div class="chapter-callout">\1</div>',
        intro_raw, flags=re.DOTALL
    )
    chapter_intro = clean_content(intro_raw, bold_classes, italic_classes, formula_color_classes)

    sections = []
    for i, h2 in enumerate(h2_matches):
        title    = clean_title(h2.group(1))
        slug     = make_slug(title, ch_num)
        if not slug:
            continue

        video_id = extract_video_from_heading(h2.group(0))
        section_start = h2.end()
        section_end   = h2_matches[i + 1].start() if i + 1 < len(h2_matches) else len(ch_html)
        content_raw   = ch_html[section_start:section_end]
        content_raw   = re.sub(
            r'<p[^>]*\bsubtitle\b[^>]*>(.*?)</p>',
            r'<div class="chapter-callout">\1</div>',
            content_raw, flags=re.DOTALL
        )
        content_clean = clean_content(content_raw, bold_classes, italic_classes, formula_color_classes)
        if i == 0 and chapter_intro:
            content_clean = chapter_intro + "\n" + content_clean

        with open(f"{OUTPUT_DIR}/{slug}.html", "w", encoding="utf-8") as f:
            f.write(content_clean)

        sections.append({"slug": slug, "title": title, "videoId": video_id, "order": i + 1})
        print(f"  ✅ {slug}: {title} {'🎬' if video_id else ''}")

    # 複製該章圖片
    used_images = set(re.findall(r"images/(image\d+\.png)", ch_html))
    copied = 0
    for img in used_images:
        src = os.path.join(IMAGES_SRC, img)
        dst = os.path.join(IMAGES_DEST, img)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            copied += 1
    print(f"  📷 複製 {copied} 張圖片")

    return {
        "slug":     f"chapter-{ch_num}",
        "title":    ch_title,
        "videoId":  ch_video,
        "sections": sections,
    }

# ── 主程式 ───────────────────────────────��────────────────────

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(IMAGES_DEST, exist_ok=True)

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        full_html = f.read()

    style_block = re.search(r"<style[^>]*>(.*?)</style>", full_html, re.DOTALL)
    css = style_block.group(1) if style_block else ""
    bold_classes   = re.findall(r'\.(c\d+)[^{]*\{[^}]*font-weight:\s*700[^}]*\}', css)
    italic_classes = re.findall(r'\.(c\d+)[^{]*\{[^}]*font-style:\s*italic[^}]*\}', css)

    formula_color_classes = {}
    for m in re.finditer(r'\.(c\d+)\{([^}]+)\}', css):
        cls, body = m.group(1), m.group(2)
        if re.match(r'^color:#([0-9a-fA-F]{6})$', body.strip()):
            color = re.search(r'color:#([0-9a-fA-F]{6})', body).group(1).lower()
            if color in FORMULA_COLORS:
                formula_color_classes[cls] = FORMULA_COLORS[color]
    print(f"🎨 公式顏色 class：{formula_color_classes}")

    h1_matches = list(re.finditer(r"<h1[^>]*>.*?</h1>", full_html, re.DOTALL))
    h1_titles  = [re.sub(r"<[^>]+>", "", m.group()).strip() for m in h1_matches]

    chapters = []
    for ch_num in CHAPTERS_TO_PARSE:
        print(f"\n🔍 解析 Chapter {ch_num}...")
        ch = parse_chapter(full_html, ch_num, bold_classes, italic_classes,
                           formula_color_classes, h1_matches, h1_titles)
        if ch:
            chapters.append(ch)
            print(f"  📄 {len(ch['sections'])} 個小節")

    # 合併現有 meta.json（保留已編輯的舊章節）
    meta_path = f"{OUTPUT_DIR}/meta.json"
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
        existing_slugs = {c["slug"] for c in existing["chapters"]}
        for ch in chapters:
            if ch["slug"] not in existing_slugs:
                existing["chapters"].append(ch)
            else:
                # 重新解析：合併新內容，保留既有的自訂欄位（desc / exampleUrl 等）
                existing["chapters"] = [{**c, **ch} if c["slug"] == ch["slug"] else c
                                        for c in existing["chapters"]]
        meta = existing
    else:
        meta = {"chapters": chapters}

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(f"\n✅ 完成！共 {sum(len(c['sections']) for c in meta['chapters'])} 個小節（全部章節）")

if __name__ == "__main__":
    main()
