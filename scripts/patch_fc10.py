#!/usr/bin/env python3
"""
逐檔將 f-c10 (#1155cc) span wrapping 補進 content/tutorial/。
原則：
  - 以 /tmp/without_fix vs /tmp/with_fix 為對照組，找出每個 c25 應該包住的文字 (text)。
  - 跳過 c25 內含 <a> 的 wrap（那是超連結，不是公式中的數字/True/False）。
  - 在使用者檔中以 fingerprint 比對找位置；若該位置已有 f-c10 wrap 則略過，否則新增。
  - 既有的 f-c10 wrap（無論是否對應 c25）都保留下來，不會移除。
"""
import os, re, html as htmllib

USER_DIR = "content/tutorial"
WITHOUT_DIR = "/tmp/without_fix"
WITH_DIR = "/tmp/with_fix"

OPEN_TAG = '<span class="f-c10">'
CLOSE_TAG = '</span>'

# ── extract: 哪些 (text, pos_in_without) 該補上 f-c10 ──────────────

def extract_wrappings(without: str, withfix: str):
    wrappings = []
    skipped_links = 0
    i = j = 0
    while j < len(withfix):
        if withfix.startswith(OPEN_TAG, j):
            j_after_open = j + len(OPEN_TAG)
            close = withfix.find(CLOSE_TAG, j_after_open)
            if close == -1:
                raise RuntimeError(f"找不到 close tag at j={j_after_open}")
            text = withfix[j_after_open:close]
            if without[i:i+len(text)] != text:
                raise RuntimeError(
                    f"text 不一致 at i={i}, j={j}: "
                    f"without={without[i:i+len(text)+10]!r} text={text!r}")
            if '<a ' in text or '<a\n' in text:
                skipped_links += 1
            else:
                wrappings.append((text, i))
            i += len(text)
            j = close + len(CLOSE_TAG)
            continue
        if i < len(without) and without[i] == withfix[j]:
            i += 1; j += 1
            continue
        raise RuntimeError(
            f"非預期差異 at i={i} j={j}: "
            f"without={without[i:i+50]!r} with={withfix[j:j+50]!r}")
    return wrappings, skipped_links

# ── normalize 比對用：HTML entity 解碼 + 去除既有 f-c10 wrap tag ──

# 同時處理 entity 與 f-c10 tag。回傳 (decoded_str, map[]):
# map[k] = decoded[k] 對應 source 中的起始 byte 位置；
# map 多一個尾端值 = len(source)。
def normalize_for_match(s: str, strip_fc10_tags: bool):
    parts = []
    map_starts = []
    pos = 0
    if strip_fc10_tags:
        # 把 f-c10 開合 tag 視為 0 寬度（從 source 跳過，不對應任何 decoded char）
        pat = re.compile(
            r'(?P<fcopen><span class="f-c10">)|'
            r'(?P<ent>&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]+);)'
        )
    else:
        pat = re.compile(r'(?P<ent>&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]+);)')
    # 記錄哪些 </span> 是 f-c10 的對應 close（透過配對）
    fc10_close_positions = set()
    if strip_fc10_tags:
        depth = 0
        # 找出 OPEN 與接下來最近的 CLOSE 配對（c25 內無巢狀 span）
        i = 0
        while i < len(s):
            if s.startswith(OPEN_TAG, i):
                close = s.find(CLOSE_TAG, i + len(OPEN_TAG))
                if close == -1:
                    break
                # 確認中間沒有 <span，否則無法保證簡單配對；c25 wrap 內最多含 <a>
                fc10_close_positions.add(close)
                i = close + len(CLOSE_TAG)
            else:
                i += 1

    i = 0
    while i < len(s):
        # 是否為 f-c10 OPEN
        if strip_fc10_tags and s.startswith(OPEN_TAG, i):
            i += len(OPEN_TAG)
            continue
        # 是否為配對的 CLOSE
        if strip_fc10_tags and i in fc10_close_positions:
            i += len(CLOSE_TAG)
            continue
        # entity?
        if s[i] == '&':
            m = re.match(r'&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]+);', s[i:])
            if m:
                ent_text = m.group(0)
                decoded_char = htmllib.unescape(ent_text)
                for _ in range(len(decoded_char)):
                    map_starts.append(i)
                parts.append(decoded_char)
                i += len(ent_text)
                continue
        # 一般字元
        map_starts.append(i)
        parts.append(s[i])
        i += 1
    map_starts.append(len(s))
    return ''.join(parts), map_starts

# ── apply ────────────────────────────────────────────────────────

def apply_wrappings(user: str, without: str, wrappings):
    user_dec, user_map = normalize_for_match(user, strip_fc10_tags=True)
    without_dec, without_map = normalize_for_match(without, strip_fc10_tags=False)

    # 從 without 原座標 → without_dec 座標
    # 建表：對每個 dec 索引 k，without_map[k] 是 source 起始；
    # 我們要的反向：給 src_pos，找最小 k 使 without_map[k] >= src_pos
    cache = [0] * (len(without) + 2)
    k = 0
    for src_p in range(len(without) + 1):
        while k < len(without_map) - 1 and without_map[k] < src_p:
            k += 1
        cache[src_p] = k
    def orig_to_dec(p):
        return cache[p]

    out = []
    user_pos = 0
    user_pos_dec = 0
    without_pos_dec = 0
    applied = 0
    skipped_already = 0
    skipped_notfound = []

    for text, target in wrappings:
        target_dec = orig_to_dec(target)
        text_dec = htmllib.unescape(text)
        located_dec = -1
        for fp_len in (80, 50, 30, 20, 12, 8, 5, 3, 2):
            fp_start = max(without_pos_dec, target_dec - fp_len)
            if fp_start >= target_dec:
                continue
            fp = without_dec[fp_start:target_dec]
            idx = user_dec.find(fp + text_dec, user_pos_dec)
            if idx >= 0:
                located_dec = idx + len(fp)
                break
        if located_dec == -1:
            skipped_notfound.append((text, target))
            continue
        # 對應到 user 原字串座標
        located_orig = user_map[located_dec]
        text_end_dec = located_dec + len(text_dec)
        # 計算 text 在 user 中真正佔用的「原字串」結尾位置：
        # 從 located_orig 起，逐字解析 entity / 一般字元，並驗證每個 decoded char 都符合 text_dec
        consumed = 0
        cur = located_orig
        match_ok = True
        while consumed < len(text_dec) and cur < len(user):
            m = re.match(r'&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]+);', user[cur:])
            if m:
                ent_decoded = htmllib.unescape(m.group(0))
                if text_dec[consumed:consumed+len(ent_decoded)] != ent_decoded:
                    match_ok = False; break
                consumed += len(ent_decoded)
                cur += len(m.group(0))
            else:
                if user[cur] != text_dec[consumed]:
                    match_ok = False; break
                consumed += 1
                cur += 1
        if not match_ok or consumed != len(text_dec):
            skipped_notfound.append((text, target))
            continue
        text_end_orig = cur
        # 判斷是否已落在某個既有 f-c10 wrap 內：
        # 找 located_orig 之前最近的 OPEN，以及它後面最近的 </span>。若該 wrap 範圍包住 text，視為已 wrap。
        last_open = user.rfind(OPEN_TAG, 0, located_orig + 1)
        already_wrapped = False
        wrap_close = -1
        if last_open != -1:
            cand_close = user.find(CLOSE_TAG, last_open + len(OPEN_TAG))
            # 中間若出現新的 <span，代表這個 OPEN 已被別的 span 結束過，不算包住 located_orig
            mid_span = user.find('<span', last_open + len(OPEN_TAG))
            if cand_close != -1 and (mid_span == -1 or mid_span >= cand_close):
                if last_open <= located_orig and cand_close >= text_end_orig:
                    already_wrapped = True
                    wrap_close = cand_close
        if already_wrapped:
            skipped_already += 1
            new_user_pos = wrap_close + len(CLOSE_TAG)
            out.append(user[user_pos:new_user_pos])
            user_pos = new_user_pos
            user_pos_dec = text_end_dec
            without_pos_dec = target_dec + len(text_dec)
            continue
        actual_text = user[located_orig:text_end_orig]
        out.append(user[user_pos:located_orig])
        out.append(f'{OPEN_TAG}{actual_text}{CLOSE_TAG}')
        user_pos = text_end_orig
        user_pos_dec = text_end_dec
        without_pos_dec = target_dec + len(text_dec)
        applied += 1
    out.append(user[user_pos:])
    return ''.join(out), applied, skipped_already, skipped_notfound

# ── main ─────────────────────────────────────────────────────────

def main():
    files = sorted(os.listdir(WITH_DIR))
    total_applied = 0
    total_already = 0
    total_notfound = 0
    for name in files:
        if not name.endswith('.html'):
            continue
        wo_path = os.path.join(WITHOUT_DIR, name)
        wf_path = os.path.join(WITH_DIR, name)
        user_path = os.path.join(USER_DIR, name)
        if not (os.path.exists(wo_path) and os.path.exists(wf_path) and os.path.exists(user_path)):
            continue
        wo = open(wo_path).read()
        wf = open(wf_path).read()
        if wo == wf:
            continue
        try:
            wrappings, link_skipped = extract_wrappings(wo, wf)
        except RuntimeError as e:
            print(f"  ✗ {name}: extract 失敗: {e}")
            continue
        if not wrappings:
            continue
        user = open(user_path).read()
        new_user, applied, already, notfound = apply_wrappings(user, wo, wrappings)
        if new_user != user:
            open(user_path, 'w').write(new_user)
        marker = '✅' if not notfound else '⚠️'
        bits = [f"新增 {applied}"]
        if already: bits.append(f"已存在 {already}")
        if notfound: bits.append(f"找不到位置 {len(notfound)}")
        if link_skipped: bits.append(f"連結略過 {link_skipped}")
        print(f"  {marker} {name}: " + "，".join(bits))
        if notfound:
            for t, p in notfound[:3]:
                print(f"      - 跳過 {t!r} @ {p}")
        total_applied += applied
        total_already += already
        total_notfound += len(notfound)
    print(f"\n總計：新增 {total_applied}，已存在 {total_already}，找不到 {total_notfound}")

if __name__ == '__main__':
    main()
