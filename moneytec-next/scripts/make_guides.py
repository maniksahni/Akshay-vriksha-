#!/usr/bin/env python3
"""One-off generator for Moneytec's static guide pages. The output HTML in public/ is what gets maintained."""
import html
import json
import re
import sys
from pathlib import Path

OUT = Path(sys.argv[1])
SITE = 'https://moneytec.in'
UPDATED = '2026-11-05'
DISCLAIMER = ('Mutual fund investments are subject to market risks; read all scheme-related documents carefully. '
              'Illustrations assume a constant return and are not a promise of future returns. '
              'Insurance is the subject matter of solicitation.')
GUIDES = [
    ('learn', 'All guides'),
    ('what-is-mutual-fund', 'What is a mutual fund?'),
    ('what-is-sip', 'What is a SIP?'),
    ('power-of-compounding', 'The power of compounding'),
    ('goal-based-investing', 'Goal-based investing'),
    ('how-to-start-sip', 'How to start a SIP'),
    ('sip-calculator', 'SIP calculator'),
    ('elss-tax-saving-funds', 'ELSS tax-saving funds'),
    ('mutual-fund-kyc', 'Mutual fund KYC'),
    ('mutual-fund-terms', 'Mutual fund terms explained'),
    ('portfolio-review', 'Portfolio review'),
    ('nri-mutual-fund-investment', 'NRI mutual fund investment'),
    ('what-is-life-insurance', 'What is life insurance?'),
    ('what-is-health-insurance', 'What is health insurance?'),
    ('how-moneytec-works', 'How Moneytec works'),
    ('mutual-fund-distributor-rohini-delhi', 'Mutual fund distributor in Rohini'),
]


PAGES = []
BLURBS = {
    'learn': 'Every guide, in one place',
    'what-is-mutual-fund': 'How it works, NAV, types, costs and risks',
    'what-is-sip': 'How it works, with a worked example',
    'power-of-compounding': 'Growth on growth, and our verse',
    'goal-based-investing': 'From a goal to a monthly amount',
    'how-to-start-sip': 'Six steps and the documents',
    'sip-calculator': 'Try your own numbers',
    'elss-tax-saving-funds': 'The 3-year lock-in and tax rules',
    'mutual-fund-kyc': 'Documents, process and status',
    'mutual-fund-terms': 'NAV, CAGR, AMC, exit load and more',
    'portfolio-review': 'What to check, and when',
    'nri-mutual-fund-investment': 'NRE, NRO, documents, US and Canada',
    'what-is-life-insurance': 'Types of cover, and how claims work',
    'what-is-health-insurance': 'Cashless, waiting periods and floaters',
    'how-moneytec-works': 'What we do, how we are paid, where your money goes',
    'mutual-fund-distributor-rohini-delhi': 'About Gulshan Kohli, ARN-105840',
}


TITLES = {
    'what-is-mutual-fund': 'What Is a Mutual Fund? Types, NAV & Risks | Moneytec',
    'what-is-sip': 'What Is a SIP? How It Works, SIP vs Lump Sum | Moneytec',
    'elss-tax-saving-funds': 'ELSS Funds: Lock-in, Tax Rules & SIPs | Moneytec',
    'goal-based-investing': 'Goal-Based Investing: Plan a Monthly SIP | Moneytec',
    'how-moneytec-works': 'How Moneytec Works: Fees & Your Money’s Safety',
    'how-to-start-sip': 'How to Start a SIP in India: Steps & Documents',
    'learn': 'Learn Mutual Funds, SIPs & Insurance Basics | Moneytec',
    'mutual-fund-distributor-rohini-delhi': 'Mutual Fund Distributor in Rohini, Delhi | Gulshan Kohli',
    'mutual-fund-kyc': 'Mutual Fund KYC: Documents, Process & Status | Moneytec',
    'mutual-fund-terms': 'Mutual Fund Terms: NAV, CAGR, AMC, Exit Load | Moneytec',
    'nri-mutual-fund-investment': 'NRI Mutual Fund Investment in India: NRE & NRO Guide',
    'what-is-health-insurance': 'What Is Health Insurance? Cashless & Waiting Periods',
    'what-is-life-insurance': 'What Is Life Insurance? Term Plans & Claims | Moneytec',
}
DESCS = {
    'elss-tax-saving-funds': 'ELSS funds explained: the 3-year lock-in, how each SIP instalment is locked, the old and new tax regimes, and the risks to understand first.',
    'goal-based-investing': 'Work out the future cost of education, a home or retirement with inflation, then the monthly SIP it may take. A worked example inside.',
    'how-moneytec-works': 'What Moneytec does and does not do: one-to-one guidance from Gulshan Kohli (ARN-105840), how we are paid, and where your money goes.',
    'how-to-start-sip': 'How to start a SIP in India: minimum amount, KYC documents, choosing a date, and how to pause or stop. Many schemes accept ₹500 a month.',
    'mutual-fund-distributor-rohini-delhi': 'Mutual fund distributor in Rohini, New Delhi: Gulshan Kohli (AMFI ARN-105840) helps with SIPs, goal planning, reviews and NRI investing.',
    'mutual-fund-kyc': 'Mutual fund KYC explained: the documents you need, how it works online, what your KYC status means, and how it differs for NRIs.',
    'nri-mutual-fund-investment': 'Can NRIs invest in Indian mutual funds? Yes, through NRE or NRO accounts. See the documents, KYC, and what US and Canada residents should know.',
    'portfolio-review': 'What a mutual fund portfolio review checks: goals, overlap, costs, risk, nominee and KYC details, and how to avoid costly switches.',
    'power-of-compounding': 'What is compounding? See how growth on growth works, why starting early matters, the Rule of 72, and the verse on Moneytec. Illustrations only.',
    'sip-calculator': 'Free SIP calculator with the formula explained. Enter a monthly amount, time period and assumed return. Returns are not guaranteed.',
    'what-is-health-insurance': 'What is health insurance? Cashless vs reimbursement, individual vs floater, waiting periods, room rent limits, co-pay and what to check.',
    'what-is-life-insurance': 'What is life insurance and how much cover might a family need? Term plans vs other policies, exclusions and claims, explained simply.',
    'what-is-mutual-fund': 'What is a mutual fund? How they work in India: units and NAV, equity, debt and hybrid types, costs, risks, and who regulates them.',
    'what-is-sip': 'What is a SIP (Systematic Investment Plan)? How it works, rupee cost averaging with a worked example, SIP vs lump sum, and common myths.',
}


def slugify(text):
    slug = re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', '', text).lower()).strip('-')
    # an id starting with a digit is not a valid CSS selector
    return f's-{slug}' if slug[:1].isdigit() else slug


def panels(body):
    '''Wrap each h2 block in a numbered glass panel and return it with the page's table of contents.'''
    parts = re.split(r'(?=<h2>)', body.strip())
    intro, out, toc = '', [], []
    for part in parts:
        m = re.match(r'<h2>(.*?)</h2>', part, re.S)
        if not m:
            intro = part
            continue
        n, sid = len(toc) + 1, slugify(m.group(1))
        toc.append((sid, m.group(1)))
        rest = part[m.end():]
        out.append(f'<section class="panel reveal" id="{sid}"><p class="num">{n:02d}</p><h2>{m.group(1)}</h2>{rest}</section>')
    return intro + '\n'.join(out), toc


FONTS_HEAD = '<link rel="preload" href="/fonts/inter-latin-v1.woff2" as="font" type="font/woff2" crossorigin />\n<link rel="preload" href="/fonts/instrument-serif-latin-normal-v1.woff2" as="font" type="font/woff2" crossorigin />\n<link rel="preload" href="/fonts/instrument-serif-latin-italic-v1.woff2" as="font" type="font/woff2" crossorigin />\n<style>@font-face{font-family:\'Inter\';font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/inter-latin-v1.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:\'Inter\';font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/inter-latin-ext-v1.woff2) format(\'woff2\');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:\'Instrument Serif\';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-normal-v1.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:\'Instrument Serif\';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-ext-normal-v1.woff2) format(\'woff2\');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:\'Instrument Serif\';font-style:italic;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-italic-v1.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:\'Instrument Serif\';font-style:italic;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-ext-italic-v1.woff2) format(\'woff2\');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}</style>'


def page(slug, title, desc, h1, lede, body, faqs, extra_script='', schema_type='Article'):
    title, desc = TITLES.get(slug, title), DESCS.get(slug, desc)
    PAGES.append((slug, title, re.sub(r'<[^>]+>', ' ', lede + ' ' + body)))
    url = f'{SITE}/{slug}'
    crumb = '' if slug == 'learn' else '<a href="/learn">Learn</a> <span aria-hidden="true">/</span> '
    graph = [
        {
            '@type': schema_type, '@id': f'{url}#page', 'headline': h1, 'name': title, 'description': desc, 'url': url,
            'inLanguage': 'en-IN', 'datePublished': UPDATED, 'dateModified': UPDATED, 'image': f'{SITE}/og-moneytec.jpg',
            'author': {'@type': 'Person', '@id': f'{SITE}/#gulshan', 'name': 'Gulshan Kohli', 'url': f'{SITE}/mutual-fund-distributor-rohini-delhi'},
            'publisher': {'@type': 'Organization', '@id': f'{SITE}/#business', 'name': 'Moneytec', 'logo': {'@type': 'ImageObject', 'url': f'{SITE}/icon-512.png'}},
        },
        {
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Moneytec', 'item': f'{SITE}/'},
                *([] if slug == 'learn' else [{'@type': 'ListItem', 'position': 2, 'name': 'Learn', 'item': f'{SITE}/learn'}]),
                {'@type': 'ListItem', 'position': 2 if slug == 'learn' else 3, 'name': h1, 'item': url},
            ],
        },
    ]
    if schema_type == 'WebApplication':
        graph[0].update({'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Any', 'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'INR'}})
    if faqs:
        graph.append({
            '@type': 'FAQPage',
            'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faqs],
        })
    ld = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, indent=1).replace('</', '<\\/')
    if faqs:
        items = ''.join(f'<details class="faq" name="faq"{" open" if i == 0 else ""}><summary><h3>{html.escape(q)}</h3><i aria-hidden="true"></i></summary><p>{html.escape(a)}</p></details>\n' for i, (q, a) in enumerate(faqs))
        body = body + f'\n<h2>Frequently asked questions</h2>\n{items}'
    content, toc = panels(body)
    words = len(re.sub(r'<[^>]+>', ' ', content + lede).split())
    minutes = max(2, round(words / 200))
    toc_links = ''.join(f'<li><a href="#{i}">{t}</a></li>' for i, t in toc)
    toc_html = '' if slug == 'learn' else f'<nav class="toc" aria-label="On this page"><details open><summary>On this page</summary><ol>{toc_links}</ol></details></nav>'
    order = [s for s, _ in GUIDES if s != 'learn']
    at = order.index(slug) if slug in order else -1
    names = dict(GUIDES)
    related = [order[(at + k) % len(order)] for k in (1, 2, 3)]
    cards = ''.join(f'<a class="rel" href="/{s}"><b>{html.escape(names[s])}</b><span>{html.escape(BLURBS[s])}</span><i aria-hidden="true">→</i></a>' for s in related)
    more = '' if slug == 'learn' else f'<section class="more reveal"><div class="more-head"><h2>Keep reading</h2><a href="/learn">All guides →</a></div><div class="rels">{cards}</div></section>'
    head_words = html.escape(h1).rsplit(' ', 1)
    title_html = f'{head_words[0]} <em>{head_words[1]}</em>' if len(head_words) == 2 else head_words[0]
    wa = 'https://wa.me/919136792367?text=' + 'Hi%20Gulshan!%20I%20read%20your%20guide%20and%20have%20a%20question.'
    doc = f'''<!doctype html>
<html lang="en-IN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#FBF8F3" />
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc, quote=True)}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="author" content="Gulshan Kohli" />
<link rel="canonical" href="{url}" />
<meta property="og:site_name" content="Moneytec" />
<meta property="og:type" content="article" />
<meta property="og:title" content="{html.escape(title, quote=True)}" />
<meta property="og:description" content="{html.escape(desc, quote=True)}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{SITE}/og-moneytec.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
{FONTS_HEAD}
<link rel="stylesheet" href="/guide-v5.css" />
<script>document.documentElement.className += ' js';</script>
<script type="application/ld+json">
{ld}
</script>
</head>
<body class="{'is-hub' if slug == 'learn' else ''}">
<div class="sky" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="progress" aria-hidden="true"><i id="bar"></i></div>
<header class="top"><div class="top-in"><a href="/" aria-label="Moneytec home"><img src="/brand/moneytec-logo-light.svg" alt="Moneytec" width="174" height="32" /></a><nav aria-label="Main"><a class="tlink" href="/learn">Learn</a><a class="pill" href="{wa}">Talk to Gulshan</a></nav></div></header>
<div class="hero">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Moneytec</a> <span aria-hidden="true">/</span> {crumb}{html.escape(h1)}</nav>
<h1>{title_html}</h1>
<p class="lede">{html.escape(lede)}</p>
<p class="meta">{'' if slug == 'learn' else f'<span>{minutes} min read</span>'}<span>By Gulshan Kohli, ARN-105840</span><span>Updated 5 Nov 2026</span></p>
</div>
<div class="layout">
{toc_html}
<main>
{content}
<aside class="cta reveal"><p class="eyebrow">A real person. On your side.</p><h2>Have a question about <em>your</em> situation?</h2><p>Speak with Gulshan Kohli directly, one to one. There is no form to fill in, and nothing is invested from this website.</p><p class="btns"><a class="btn" href="{wa}">Message on WhatsApp <span aria-hidden="true">↗</span></a> <a class="btn ghost" href="tel:+919136792367">Call +91 91367 92367</a></p></aside>
{more}
</main>
</div>
<footer><div class="foot-in"><img src="/brand/moneytec-logo-light.svg" alt="Moneytec" width="150" height="28" /><p><strong>Gulshan Kohli</strong> is an AMFI-registered mutual fund distributor (ARN-105840) and a Kotak Life Insurance advisor (KLI61205587), based in Rohini, New Delhi. <a href="https://www.amfiindia.com/locate-distributor" rel="noopener">Verify on AMFI</a>.</p><p>This guide is general information, not personal investment, tax or legal advice. Rules can change; check the scheme documents and current regulations before you act. {DISCLAIMER}</p><p class="legal">© 2026 moneytec · Rohini, New Delhi · <a href="/">Home</a> · <a href="/learn">Learn</a></p></div><p class="mark" aria-hidden="true">moneytec</p></footer>
<script src="/guide-v5.js" defer></script>
{extra_script}
</body>
</html>
'''
    (OUT / f'{slug}.html').write_text(doc, encoding='utf-8')


CSS = '''*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;scroll-padding-top:90px;background:#07060B}
body{margin:0;color:#F4F1F8;font:17px/1.72 Inter,system-ui,-apple-system,sans-serif;overflow-x:hidden;overflow-x:clip;-webkit-font-smoothing:antialiased}
a{color:#FF8FA5;text-underline-offset:3px;text-decoration-color:rgba(255,143,165,.5)}
a:hover{color:#fff}
:focus-visible{outline:2px solid #FF8FA5;outline-offset:3px;border-radius:6px}
.sky{position:fixed;top:0;left:0;right:0;height:100vh;height:100svh;z-index:-1;overflow:hidden;pointer-events:none}
.sky::after{content:'';position:absolute;left:0;right:0;bottom:0;height:130px;background:linear-gradient(rgba(7,6,11,0),#07060B)}
.sky i{position:absolute;display:block;border-radius:50%}
.sky i:nth-child(1){width:60vmax;height:60vmax;right:-22vmax;top:-26vmax;background:radial-gradient(closest-side,rgba(191,90,242,.34),transparent)}
.sky i:nth-child(2){width:46vmax;height:46vmax;left:-20vmax;top:-12vmax;background:radial-gradient(closest-side,rgba(255,159,10,.18),transparent)}
.sky i:nth-child(3){width:54vmax;height:54vmax;left:12%;bottom:-34vmax;background:radial-gradient(closest-side,rgba(255,55,95,.16),transparent)}
.progress{position:fixed;inset:0 0 auto;z-index:60;height:2px}
.progress i{display:block;height:100%;width:100%;transform:scaleX(0);transform-origin:0 50%;background:linear-gradient(90deg,#FF9F0A,#FF375F 55%,#BF5AF2)}
.top{position:sticky;top:0;z-index:50;padding:12px 12px 0}
.top-in{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:1180px;height:56px;margin:0 auto;padding:0 8px 0 18px;border:1px solid rgba(255,255,255,.1);border-radius:99px;background:rgba(7,6,11,.95)}
.top img{display:block;height:24px;width:auto}
.top nav{display:flex;align-items:center;gap:6px}
.tlink{padding:8px 12px;color:rgba(255,255,255,.8);font-size:14px;text-decoration:none}
.pill{flex:none;padding:10px 16px;border-radius:99px;background:linear-gradient(100deg,#FF9F0A,#FF375F 55%,#BF5AF2);color:#fff;font-size:13px;font-weight:600;text-decoration:none;white-space:nowrap}
.pill:hover{color:#fff;box-shadow:0 10px 30px -10px rgba(255,55,95,.8)}
.hero{max-width:1180px;margin:0 auto;padding:clamp(36px,7vw,84px) 20px clamp(20px,4vw,44px)}
.crumbs{font-size:13px;color:rgba(255,255,255,.6)}
.crumbs a{color:inherit;text-decoration:none}
.crumbs a:hover{color:#fff}
h1,h2{font-family:'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:-.018em}
h1{max-width:18ch;margin:16px 0 18px;font-size:clamp(46px,9vw,104px);line-height:.98}
h1 em,.cta h2 em{font-style:italic;background:linear-gradient(100deg,#FFB340 0%,#FF375F 48%,#BF5AF2 92%);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.06em}
.lede{max-width:44rem;margin:0;font-size:clamp(18px,2.3vw,22px);line-height:1.6;color:rgba(255,255,255,.88)}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;margin:20px 0 0;font-size:13px;color:rgba(255,255,255,.62)}
.meta span+span::before{content:'';display:inline-block;width:4px;height:4px;margin-right:18px;border-radius:50%;background:#FF5C7A;vertical-align:middle}
.layout{display:block;max-width:1180px;margin:0 auto;padding:0 20px 24px}
main{min-width:0}
.toc{margin-bottom:16px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(255,255,255,.035)}
.toc summary{padding:13px 18px;cursor:pointer;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.72)}
.toc ol{margin:0;padding:0 18px 14px;list-style:none;counter-reset:t}
.toc li{margin:0;counter-increment:t}
.toc a{display:block;padding:6px 0;font-size:14px;line-height:1.4;color:rgba(255,255,255,.76);text-decoration:none}
.toc a::before{content:counter(t,decimal-leading-zero);margin-right:10px;font-size:11px;color:#FF8FA5}
.toc a:hover,.toc a.on{color:#fff}
.panel{position:relative;margin:0 0 16px;padding:clamp(22px,4vw,38px);border:1px solid rgba(255,255,255,.1);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.018))}
.panel::before{content:'';position:absolute;left:28px;right:28px;top:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,143,165,.55),transparent)}
.num{margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:.2em;color:#FF8FA5}
h2{margin:0 0 14px;font-size:clamp(30px,4.6vw,44px);line-height:1.08}
h3{margin:24px 0 6px;font-size:18px;line-height:1.35}
p{margin:0 0 14px}
.panel>:last-child{margin-bottom:0}
strong{font-weight:600;color:#fff}
.panel ul,.panel ol{margin:0 0 16px;padding:0;list-style:none}
.panel ul>li{position:relative;margin-bottom:10px;padding-left:24px}
.panel ul>li::before{content:'';position:absolute;left:2px;top:.68em;width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#FF9F0A,#FF375F 55%,#BF5AF2)}
.panel ol{counter-reset:s}
.panel ol>li{position:relative;counter-increment:s;margin-bottom:0;padding:0 0 18px 50px}
.panel ol>li::before{content:counter(s);position:absolute;left:0;top:0;display:grid;place-items:center;width:34px;height:34px;border:1px solid rgba(255,255,255,.2);border-radius:50%;background:#0E0C14;font-size:13px;font-weight:600}
.panel ol>li:not(:last-child)::after{content:'';position:absolute;left:17px;top:38px;bottom:2px;width:1px;background:linear-gradient(#FF375F,rgba(191,90,242,.1))}
.scroll{overflow-x:auto;margin:6px 0 18px;border:1px solid rgba(255,255,255,.13);border-radius:16px;-webkit-overflow-scrolling:touch}
table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.5}
th,td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.09);text-align:left;vertical-align:top}
tr:last-child th,tr:last-child td{border-bottom:0}
tr:first-child th{background:rgba(255,255,255,.06);font-size:13px;font-weight:600;color:#fff}
tbody th,tr>th:first-child{font-weight:600;color:#fff}
tr:hover td{background:rgba(255,255,255,.02)}
code{padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.08);font-size:.88em;overflow-wrap:anywhere}
.note{padding:14px 16px;border:1px solid rgba(255,179,64,.3);border-radius:14px;background:rgba(255,159,10,.07);font-size:15px;line-height:1.6}
.faq{border-top:1px solid rgba(255,255,255,.11)}
.faq:last-child{border-bottom:1px solid rgba(255,255,255,.11)}
.faq summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;cursor:pointer;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq h3{margin:0;font-size:17px;font-weight:600}
.faq i{position:relative;flex:none;width:30px;height:30px;border:1px solid rgba(255,255,255,.2);border-radius:50%;transition:transform .35s,background .35s}
.faq i::before,.faq i::after{content:'';position:absolute;left:50%;top:50%;width:11px;height:1.5px;margin:-.75px 0 0 -5.5px;background:#fff}
.faq i::after{transform:rotate(90deg)}
.faq[open] i{transform:rotate(45deg);background:rgba(255,92,122,.3)}
.faq p{padding-right:44px;color:rgba(255,255,255,.84)}
.cta{position:relative;overflow:hidden;margin:28px 0;padding:clamp(26px,5vw,52px);border:1px solid rgba(255,255,255,.14);border-radius:28px;background:radial-gradient(70% 120% at 100% 0,rgba(191,90,242,.32),transparent 70%),radial-gradient(60% 110% at 0 100%,rgba(255,159,10,.16),transparent 70%),#0E0C14}
.eyebrow{margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#FF8FA5}
.cta h2{font-size:clamp(34px,5.4vw,56px)}
.btns{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 0}
.btn{display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 22px;border-radius:99px;background:#F4F1F8;color:#07060B;font-size:15px;font-weight:600;text-decoration:none;transition:transform .25s,box-shadow .25s}
.btn:hover{color:#07060B;transform:translateY(-2px);box-shadow:0 14px 34px -12px rgba(255,55,95,.7)}
.btn.ghost{background:transparent;border:1px solid rgba(255,255,255,.3);color:#fff}
.btn.ghost:hover{color:#fff}
.more{margin:36px 0 20px}
.more-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:14px}
.more-head h2{margin:0}
.more-head a{flex:none;font-size:14px}
.rels,.hub{display:grid;gap:12px}
.rel,.hub a{position:relative;display:block;padding:20px 44px 20px 20px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(255,255,255,.04);color:#F4F1F8;text-decoration:none;transition:transform .3s,border-color .3s,background .3s}
.rel:hover,.hub a:hover{color:#fff;transform:translateY(-3px);border-color:rgba(255,143,165,.6);background:rgba(255,255,255,.07)}
.rel b,.hub b{display:block;font-size:17px;font-weight:600;line-height:1.35}
.rel span,.hub span{display:block;margin-top:4px;font-size:14px;line-height:1.45;color:rgba(255,255,255,.7)}
.rel i,.hub a::after{content:'→';position:absolute;right:18px;top:20px;font-style:normal;color:#FF8FA5;transition:transform .3s}
.rel i{content:none}
.hub a::after{content:'→'}
.rel:hover i,.hub a:hover::after{transform:translateX(4px)}
.hub{margin:0;padding:0;list-style:none}
.panel ul.hub>li{margin:0;padding:0}
.panel ul.hub>li::before{display:none}
footer{margin-top:24px;overflow:hidden;border-top:1px solid rgba(255,255,255,.1)}
.foot-in{max-width:1180px;margin:0 auto;padding:30px 20px 10px;font-size:13px;line-height:1.65;color:rgba(255,255,255,.68)}
.foot-in img{display:block;height:24px;width:auto;margin-bottom:14px}
.foot-in strong{color:rgba(255,255,255,.9)}
.legal{color:rgba(255,255,255,.55)}
.mark{margin:0;font-weight:600;font-size:23vw;line-height:.84;letter-spacing:-.07em;text-align:center;white-space:nowrap;background:linear-gradient(100deg,#FFB340,#FF375F 50%,#BF5AF2);-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.24em}
.calc{display:grid;gap:18px;margin:0 0 16px}
.calc label{display:block;font-size:14px;font-weight:600}
.field{display:flex;align-items:center;gap:8px;margin-top:8px;padding:0 14px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:#0E0C14}
.field:focus-within{border-color:#FF8FA5}
.field small{flex:none;font-size:14px;font-weight:500;color:rgba(255,255,255,.62)}
.calc input[type=number]{flex:1;min-width:0;height:48px;border:0;background:transparent;color:#fff;font:600 18px Inter,system-ui,sans-serif;outline:0}
.calc input[type=range]{display:block;width:100%;height:24px;margin:8px 0 0;accent-color:#FF375F;background:transparent}
.result{padding:22px;border:1px solid rgba(255,255,255,.14);border-radius:20px;background:radial-gradient(80% 120% at 100% 0,rgba(191,90,242,.3),transparent 70%),#0E0C14}
.result em{display:block;font-style:normal;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.65)}
.result b{display:block;margin-top:4px;font-family:'Instrument Serif',Georgia,serif;font-size:clamp(48px,9vw,76px);font-weight:400;line-height:1.05;background:linear-gradient(100deg,#FFB340,#FF375F 50%,#BF5AF2);-webkit-background-clip:text;background-clip:text;color:transparent}
.split{display:flex;height:10px;margin:14px 0 10px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.1)}
.split i{display:block;height:100%;transition:width .4s}
#barPaid{background:rgba(255,255,255,.55)}
#barGrow{flex:1;background:linear-gradient(90deg,#FF9F0A,#FF375F 55%,#BF5AF2)}
.result small{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 16px;font-size:14px;color:rgba(255,255,255,.82)}
.js .reveal{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.js .reveal.in{opacity:1;transform:none}
@media (min-width:640px){
.rels{grid-template-columns:repeat(3,1fr)}
.hub{grid-template-columns:1fr 1fr}
.calc{grid-template-columns:repeat(3,1fr)}
.result{grid-column:1/-1}
}
@media (min-width:1024px){
.layout{display:grid;grid-template-columns:248px minmax(0,1fr);gap:40px;align-items:start}
.toc{position:sticky;top:92px;margin:0;border:0;background:none}
.toc summary{padding:0 0 10px;pointer-events:none;list-style:none}
.toc summary::-webkit-details-marker{display:none}
.toc ol{padding:0;border-left:1px solid rgba(255,255,255,.12)}
.toc a{padding:7px 0 7px 14px;margin-left:-1px;border-left:1px solid transparent}
.toc a.on{border-left-color:#FF5C7A}
.is-hub .layout{display:block}
}
@media (min-width:768px) and (prefers-reduced-motion:no-preference){
.sky i{animation:drift 26s ease-in-out infinite alternate}
.sky i:nth-child(2){animation-delay:-9s}
.sky i:nth-child(3){animation-delay:-17s}
}
@keyframes drift{to{transform:translate3d(6vmax,4vmax,0) scale(1.12)}}
@media (max-width:767px){.js .reveal{opacity:1;transform:none;transition:none}}
@media (max-width:420px){.tlink{padding:8px 6px}.pill{padding:10px 12px}.top img{height:20px}.faq p{padding-right:0}}
@media (max-width:360px){.top-in{padding-left:12px;padding-right:6px}.top nav{gap:2px}.top img{height:17px}.tlink{padding:6px 4px;font-size:13px}.pill{padding:9px 10px;font-size:12px}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.js .reveal{opacity:1;transform:none;transition:none}.rel,.hub a,.btn,.faq i{transition:none}}
'''

JS = '''(function () {
  // one FAQ open at a time; browsers without <details name> get the same behaviour here
  var faqs = [].slice.call(document.querySelectorAll('details.faq'));
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d && o.open) o.open = false; });
    });
  });
  var reveal = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('in'); });
  }
  var bar = document.getElementById('bar');
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var queued = false;
  function paint() {
    queued = false;
    var d = document.documentElement, max = d.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    var on = -1;
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top < innerHeight * 0.35) on = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === on); });
  }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
  paint();
  // the contents list starts closed on phones so the guide itself is what you see first
  var toc = document.querySelector('.toc details');
  if (toc && innerWidth < 1024) toc.removeAttribute('open');
  links.forEach(function (a) { a.addEventListener('click', function () { if (innerWidth < 1024 && toc) toc.removeAttribute('open'); }); });
})();
'''

for old in OUT.glob('guide-v[123].*'):
    old.unlink()
def daylight(css):
    """The guides in the site's light tone: the dark palette converted colour for colour, then tuned."""
    import re as _re
    D, IV = '23,19,29', '251,248,243'
    css = _re.sub(r'rgba\(255,255,255,([\d.]+)\)', lambda m: f'rgba({D},{m.group(1)})', css)
    css = _re.sub(r'rgba\(7,6,11,([\d.]+)\)', lambda m: f'rgba({IV},{m.group(1)})', css)
    css = _re.sub(r'rgba\(0,0,0,([\d.]+)\)', lambda m: f'rgba({D},{round(float(m.group(1))*0.22,3)})', css)
    for a, b in [('#07060B', '#FBF8F3'), ('#0E0C14', '#FFFFFF'), ('#16131E', '#FFFFFF'), ('#F4F1F8', '#17131D'), ('#FF8FA5', '#BE1E45'), ('#FF5C7A', '#BE1E45'),
                 ('rgba(255,143,165,', 'rgba(190,30,69,'), ('rgba(255,92,122,', 'rgba(190,30,69,')]:
        css = css.replace(a, b)
    css = _re.sub(r'(?<![-\w])color:#fff\b', 'color:#17131D', css)
    css = css.replace('background:#fff}', 'background:#17131D}')
    return css + """
/* daylight tuning */
.pill,.pill:hover{color:#fff}
.btn{background:#17131D;color:#FFFFFF}.btn:hover{color:#FFFFFF}
.top-in{background:rgba(251,248,243,.96);box-shadow:0 8px 24px -16px rgba(23,19,29,.25)}
.panel,.toc,.rel,.hub a,.result,.field{background:#FFFFFF}
.panel,.rel,.hub a{box-shadow:0 1px 2px rgba(23,19,29,.04),0 20px 40px -30px rgba(23,19,29,.2)}
.rel:hover,.hub a:hover{background:#FFFFFF;color:#17131D}
.panel ol>li::before{background:#FFFFFF}
.faq[open] i{background:rgba(214,38,79,.12)}
.note{background:rgba(255,159,10,.08);border-color:rgba(194,65,12,.25)}
.sky i:nth-child(1){background:radial-gradient(closest-side,rgba(191,90,242,.16),transparent)}
.sky i:nth-child(2){background:radial-gradient(closest-side,rgba(255,159,10,.14),transparent)}
.sky i:nth-child(3){background:radial-gradient(closest-side,rgba(255,55,95,.1),transparent)}
.cta{background:radial-gradient(70% 120% at 100% 0,rgba(191,90,242,.14),transparent 70%),radial-gradient(60% 110% at 0 100%,rgba(255,159,10,.12),transparent 70%),#FFFFFF}
.result{background:radial-gradient(80% 120% at 100% 0,rgba(191,90,242,.12),transparent 70%),#FFFFFF}
footer{background:#F4EFE8}
.legal{color:rgba(23,19,29,.72)}
.foot-in{color:rgba(23,19,29,.76)}
::selection{background:rgba(255,55,95,.22)}
"""

CSS = daylight(CSS)
(OUT / 'guide-v5.css').write_text(CSS, encoding='utf-8')
(OUT / 'guide-v5.js').write_text(JS, encoding='utf-8')

page(
    'mutual-fund-distributor-rohini-delhi',
    'Mutual Fund Distributor in Rohini, Delhi | Gulshan Kohli, ARN-105840',
    'Looking for a mutual fund distributor in Rohini, New Delhi? Gulshan Kohli (AMFI ARN-105840) helps with SIPs, goal planning, portfolio reviews and NRI investing, one to one.',
    'Mutual fund distributor in Rohini, New Delhi',
    'Gulshan Kohli is an AMFI-registered mutual fund distributor (ARN-105840) based in Rohini, New Delhi. With 12+ years of experience, he helps families and working professionals start SIPs, plan for goals and review their investments, one to one.',
    '''<h2>How Gulshan can help</h2>
<ul>
<li><strong>Starting a SIP:</strong> choosing an amount and timeline you can keep up, and completing KYC.</li>
<li><strong>Planning for a goal:</strong> estimating what education, a home or retirement could cost later, and the monthly amount it may take.</li>
<li><strong>Reviewing existing investments:</strong> organising SIPs and funds around your goals, timeline and comfort with risk.</li>
<li><strong>NRI investing:</strong> NRE and NRO requirements and the options available for your country.</li>
<li><strong>Family protection:</strong> exploring life cover through Kotak Life, subject to eligibility, underwriting and policy terms.</li>
</ul>
<h2>Check a distributor before you start</h2>
<p>Anyone selling mutual funds in India must hold an ARN (AMFI Registration Number). You can look up ARN-105840 yourself on the <a href="https://www.amfiindia.com/locate-distributor" rel="noopener">AMFI distributor locator</a>. Before you work with any distributor, it is worth asking:</p>
<ul>
<li>What is your ARN, and is it currently valid?</li>
<li>How are you paid on what you are suggesting?</li>
<li>Does my money go directly to the fund house?</li>
<li>Will the units be in my own name?</li>
</ul>
<h2>Your money never passes through Moneytec</h2>
<p>Your investment goes from your bank account straight to the fund house (AMC) or the insurer. Mutual fund units and policies are in your name, subject to the product terms. This website does not collect investments or premiums.</p>
<h2>Distributor or investment adviser?</h2>
<div class="scroll"><table>
<tr><th></th><th>Mutual fund distributor</th><th>SEBI-registered investment adviser</th></tr>
<tr><th>Registration</th><td>AMFI (ARN)</td><td>SEBI (RIA)</td></tr>
<tr><th>How they are usually paid</th><td>Commission from the fund house</td><td>A fee paid by the client</td></tr>
<tr><th>Plans used</th><td>Regular plans</td><td>Usually direct plans</td></tr>
</table></div>
<p>Gulshan is a distributor. Moneytec earns commission from fund houses and the insurer, as regulated by SEBI, AMFI and IRDAI, with no separate advisory fee, and he shares this upfront.</p>''',
    [
        ('Who is Gulshan Kohli?', 'Gulshan Kohli is an electronics engineer turned AMFI-registered mutual fund distributor (ARN-105840) and Kotak Life advisor (KLI61205587), based in Rohini, New Delhi, with 12+ years of experience.'),
        ('Do I need to live in Rohini to work with him?', 'No. Conversations can happen over WhatsApp or phone, and he also speaks with NRIs living abroad.'),
        ('How do I verify a mutual fund distributor?', 'Search the ARN or name on the AMFI distributor locator at amfiindia.com. Gulshan Kohli’s ARN is ARN-105840.'),
    ],
)

CALC_BODY = '''<h2>Try your numbers</h2>
<form class="calc" id="sip" onsubmit="return false">
<label for="amt">Monthly SIP<span class="field"><small>₹</small><input id="amt" type="number" inputmode="numeric" min="500" max="1000000" step="500" value="5000" /></span><input type="range" aria-label="Monthly SIP slider" data-for="amt" min="500" max="100000" step="500" value="5000" /></label>
<label for="yrs">Time period<span class="field"><input id="yrs" type="number" inputmode="numeric" min="1" max="40" step="1" value="15" /><small>years</small></span><input type="range" aria-label="Time period slider" data-for="yrs" min="1" max="40" step="1" value="15" /></label>
<label for="ret">Assumed return<span class="field"><input id="ret" type="number" inputmode="decimal" min="0" max="30" step="0.5" value="12" /><small>% a year</small></span><input type="range" aria-label="Assumed return slider" data-for="ret" min="0" max="30" step="0.5" value="12" /></label>
<div class="result" aria-live="polite"><em>Illustrated future value</em><b id="fv">—</b><div class="split" aria-hidden="true"><i id="barPaid"></i><i id="barGrow"></i></div><small><span id="paid"></span><span id="grow"></span></small></div>
</form>
<p class="note">This is an illustration that assumes the same return every year. Real returns go up and down and are not guaranteed. The 12% starting value is only an example, not a forecast.</p>
<h2>What a monthly SIP can look like</h2>
<p>Illustrative values at an assumed 12% a year, with a contribution at the start of each month:</p>
<div class="scroll"><table>
<tr><th>Monthly SIP</th><th>10 years</th><th>15 years</th><th>20 years</th><th>25 years</th></tr>
ROWS
</table></div>
<h2>The formula behind it</h2>
<p>The calculator converts the yearly return to an equivalent monthly rate, <code>i = (1 + r)<sup>1/12</sup> − 1</code>, then calculates:</p>
<p><code>Future value = P × [((1 + i)<sup>n</sup> − 1) ÷ i] × (1 + i)</code></p>
<p>Here <code>P</code> is the monthly SIP and <code>n</code> is the number of months. Some other calculators use <code>r ÷ 12</code> as the monthly rate, so their answers can be slightly higher.</p>
<h2>What moves the result most</h2>
<ul>
<li><strong>Time:</strong> later years add more because earlier growth is also growing.</li>
<li><strong>Amount:</strong> doubling the SIP doubles the illustrated value.</li>
<li><strong>Return:</strong> a small change compounds over time, so also try a lower return to see a more cautious picture.</li>
</ul>'''


def sip(monthly, annual, months):
    i = (1 + annual / 100) ** (1 / 12) - 1
    return monthly * (((1 + i) ** months - 1) / i) * (1 + i) if i else monthly * months


def inr(n):
    if n >= 1e7:
        return f'₹{n / 1e7:.2f} Cr'
    if n >= 1e5:
        return f'₹{n / 1e5:.2f} L'
    return f'₹{n:,.0f}'


rows = ''.join('<tr><th>' + f'₹{m:,}' + '</th>' + ''.join(f'<td>{inr(sip(m, 12, y * 12))}</td>' for y in (10, 15, 20, 25)) + '</tr>\n' for m in (1000, 5000, 10000, 25000))
CALC_SCRIPT = '''<script>
(function () {
  var a = document.getElementById('amt'), y = document.getElementById('yrs'), r = document.getElementById('ret');
  var fv = document.getElementById('fv'), paidEl = document.getElementById('paid'), growEl = document.getElementById('grow'), barPaid = document.getElementById('barPaid');
  var sliders = [].slice.call(document.querySelectorAll('.calc input[type=range]'));
  function fmt(n) {
    if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
    if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function run() {
    var p = +a.value, yrs = +y.value, pct = +r.value;
    if (!(p > 0) || !(yrs > 0) || !(pct >= 0)) { fv.textContent = '—'; paidEl.textContent = 'Enter an amount, a time period and a return.'; growEl.textContent = ''; barPaid.style.width = '0'; return; }
    var n = yrs * 12, i = Math.pow(1 + pct / 100, 1 / 12) - 1;
    var v = i === 0 ? p * n : p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i), paid = p * n;
    fv.textContent = fmt(v);
    paidEl.textContent = 'You put in ' + fmt(paid);
    growEl.textContent = 'Illustrated growth ' + fmt(Math.max(0, v - paid));
    barPaid.style.width = (v > 0 ? (paid / v) * 100 : 0) + '%';
  }
  [a, y, r].forEach(function (el) {
    el.addEventListener('input', function () {
      var s = document.querySelector('input[data-for=' + el.id + ']');
      if (s) s.value = el.value;
      run();
    });
  });
  sliders.forEach(function (s) {
    s.addEventListener('input', function () { document.getElementById(s.getAttribute('data-for')).value = s.value; run(); });
  });
  run();
})();
</script>'''
page(
    'sip-calculator',
    'SIP Calculator: Estimate Your Monthly SIP Returns | Moneytec',
    'Free SIP calculator with the formula explained. Enter your monthly amount, time period and assumed return to see an illustrated future value. Returns are not guaranteed.',
    'SIP calculator',
    'Enter a monthly amount, a time period and an assumed return to see what a SIP could grow to. It shows how much you put in and how much is illustrated growth.',
    CALC_BODY.replace('ROWS', rows),
    [
        ('How accurate is a SIP calculator?', 'It is only an illustration. It assumes the same return every year, while real mutual fund returns vary and can be negative over some periods. Use it to compare scenarios, not to predict an outcome.'),
        ('What return should I assume?', 'There is no correct number. Try a few, including a cautious one, because no return is guaranteed and it depends on the scheme and market conditions.'),
        ('Does this calculator include tax or fund costs?', 'No. The result is before tax and uses only the return you enter, so check the scheme’s expense ratio, any exit load and current tax rules.'),
    ],
    extra_script=CALC_SCRIPT,
    schema_type='WebApplication',
)

page(
    'how-to-start-sip',
    'How to Start a SIP in India: Steps, Documents, Minimum Amount | Moneytec',
    'How to start a SIP in India, step by step: minimum amount, documents for KYC, choosing a date, and how to pause or stop. Many schemes accept SIPs from ₹500 a month.',
    'How to start a SIP in India',
    'A SIP (Systematic Investment Plan) invests a fixed amount in a mutual fund at regular intervals, usually monthly. Many schemes accept SIPs from ₹500 a month, and most can be changed or stopped later.',
    '''<h2>Six steps to your first SIP</h2>
<ol>
<li><strong>Name the goal.</strong> Decide what the money is for and roughly when you will need it.</li>
<li><strong>Choose a comfortable amount.</strong> Start with what you can keep paying in a difficult month. You can raise it as your income grows. The <a href="/sip-calculator">SIP calculator</a> helps you compare amounts.</li>
<li><strong>Complete KYC.</strong> KYC is done once and works across fund houses, mostly online.</li>
<li><strong>Understand the scheme.</strong> Read about its risk level, costs, any exit load and the scheme documents.</li>
<li><strong>Set up the auto-debit.</strong> Choose a date soon after your salary and approve the bank mandate.</li>
<li><strong>Review it.</strong> Check in about once a year, or when your goal or income changes.</li>
</ol>
<h2>Documents you usually need</h2>
<ul>
<li>PAN</li>
<li>Aadhaar (or a passport for NRIs)</li>
<li>A bank account in your name</li>
<li>A photo</li>
</ul>
<h2>Common mistakes</h2>
<ul>
<li>Choosing an amount you cannot sustain, then stopping early.</li>
<li>Investing money you may need soon in a scheme that can fall in value.</li>
<li>Choosing a scheme only because of its recent returns. Past performance may not continue.</li>
<li>Forgetting about lock-ins. <a href="/elss-tax-saving-funds">ELSS funds</a> lock each instalment for 3 years.</li>
</ul>
<p class="note">A SIP makes investing regular. It does not guarantee a profit or protect against loss in falling markets.</p>''',
    [
        ('What is the minimum amount to start a SIP?', 'Many schemes accept SIPs from ₹500 a month. Minimums vary, so check the scheme you are considering.'),
        ('Can I stop or pause my SIP?', 'Yes. Most SIPs can be paused, changed or stopped any time. ELSS tax-saving funds lock each instalment for 3 years.'),
        ('What happens if a SIP instalment fails?', 'The instalment is usually missed for that month and your bank may charge a fee. Repeated failures can lead the fund house to cancel the SIP, so check the terms and keep the balance ready.'),
        ('Where does my SIP money go?', 'Straight from your bank account to the fund house (AMC). The units are in your name and the money does not pass through Moneytec.'),
    ],
)

page(
    'nri-mutual-fund-investment',
    'NRI Mutual Fund Investment in India: NRE, NRO, KYC, US & Canada | Moneytec',
    'Can NRIs invest in Indian mutual funds? Yes, through NRE or NRO accounts. See the difference between them, the documents and KYC, and what US and Canada residents should know.',
    'NRI mutual fund investment in India',
    'Yes, NRIs can invest in Indian mutual funds, including through SIPs. Investments are made through an NRE or NRO account in rupees. Residents of the US and Canada can invest with select fund houses only.',
    '''<h2>NRE or NRO account?</h2>
<div class="scroll"><table>
<tr><th></th><th>NRE account</th><th>NRO account</th></tr>
<tr><th>Typically used for</th><td>Money earned outside India</td><td>Income earned in India, such as rent or pension</td></tr>
<tr><th>Taking money back abroad</th><td>Generally freely repatriable</td><td>Repatriable within limits, subject to rules and paperwork</td></tr>
</table></div>
<p>Which one suits you depends on where the money came from and whether you may want to move it abroad later. Check the current rules with your bank before you invest.</p>
<h2>Documents you usually need</h2>
<ul>
<li>PAN</li>
<li>Passport, and overseas address proof</li>
<li>NRE or NRO bank account details</li>
<li>A photo</li>
<li>FATCA details about your tax residency</li>
</ul>
<p>KYC requirements can differ between fund houses, and some steps can be completed online.</p>
<h2>If you live in the US or Canada</h2>
<p>Only select fund houses accept investments from residents of the US and Canada, and they may ask for extra declarations. Check which ones accept you before you choose a scheme. Gulshan will tell you which fund houses are available for you.</p>
<h2>Tax</h2>
<p>Gains can be taxed in India, tax may be deducted at source, and your country of residence may also tax them. A double-taxation agreement may help. Ask a tax professional who knows both countries, as rules change and depend on your situation.</p>
<h2>Investing from abroad</h2>
<p>A monthly SIP can run from your NRE or NRO account. You do not need to be in India for each instalment. You can use the <a href="/sip-calculator">SIP calculator</a> to compare amounts in rupees; currency movements can change what those rupees are worth to you abroad.</p>''',
    [
        ('Can NRIs invest in Indian mutual funds?', 'Yes, through NRE or NRO accounts. Residents of the US and Canada can invest with select fund houses only.'),
        ('Can NRIs start a SIP in India?', 'Yes. A SIP can usually run from an NRE or NRO bank account after KYC is complete.'),
        ('Can I invest from the USA or Canada?', 'Yes, but only with select fund houses that accept residents of those countries, and extra declarations may be needed.'),
        ('What documents does an NRI need?', 'Usually PAN, a passport, overseas address proof, NRE or NRO account details, a photo and FATCA details. Requirements can vary between fund houses.'),
    ],
)

page(
    'elss-tax-saving-funds',
    'ELSS Tax-Saving Funds: Lock-in, Old vs New Regime, SIP Rules | Moneytec',
    'ELSS funds explained: the 3-year lock-in, how each SIP instalment is locked, the tax deduction under the old regime, the new regime, and the risks to understand first.',
    'ELSS tax-saving funds, explained',
    'An ELSS (Equity Linked Savings Scheme) is an equity mutual fund with a 3-year lock-in. Under the old tax regime, investments have been eligible for a deduction of up to ₹1.5 lakh a year, popularly known as the Section 80C benefit.',
    '''<h2>The key points</h2>
<ul>
<li><strong>Lock-in:</strong> 3 years from the date of each investment.</li>
<li><strong>Tax deduction:</strong> available under the old tax regime, within the overall ₹1.5 lakh yearly limit. It is not available under the new regime.</li>
<li><strong>Risk:</strong> ELSS funds invest mainly in equities, so their value can fall and returns are not guaranteed.</li>
</ul>
<h2>How the lock-in works with a SIP</h2>
<p>Each SIP instalment has its own 3-year lock-in. It does not all unlock together.</p>
<div class="scroll"><table>
<tr><th>Instalment invested</th><th>Can be redeemed from</th></tr>
<tr><td>January 2027</td><td>January 2030</td></tr>
<tr><td>February 2027</td><td>February 2030</td></tr>
<tr><td>March 2027</td><td>March 2030</td></tr>
</table></div>
<p>A lump sum, by contrast, is locked for 3 years from the one date you invested.</p>
<h2>Questions to ask yourself first</h2>
<ul>
<li>Which tax regime do you use? Under the new regime there is no ELSS deduction, so tax saving is not a reason to choose it.</li>
<li>Have you already used your ₹1.5 lakh limit through EPF, PPF, life insurance premiums or home-loan principal?</li>
<li>Can you leave the money invested for at least 3 years, and ideally longer, given the equity risk?</li>
</ul>
<p class="note">Income-tax law and section numbers change. Confirm the current rules and your own position with a tax professional before you invest for a deduction. Gains on redemption may also be taxable.</p>''',
    [
        ('What is the lock-in period of ELSS?', 'Three years from the date of each investment. With a SIP, each instalment is locked for its own 3 years.'),
        ('Can I claim ELSS under the new tax regime?', 'No. The ELSS deduction is available under the old tax regime, within the overall ₹1.5 lakh limit.'),
        ('Can I stop an ELSS SIP?', 'Yes, you can stop future instalments, but money already invested stays locked until each instalment finishes its 3 years.'),
    ],
)

page(
    'what-is-mutual-fund',
    'What Is a Mutual Fund? Meaning, Types, NAV & Risks Explained | Moneytec',
    'What is a mutual fund? A simple guide to how mutual funds work in India: units and NAV, equity, debt and hybrid types, costs, risks, and who regulates them.',
    'What is a mutual fund?',
    'A mutual fund pools money from many investors and invests it in shares, bonds or other assets, as set out in the scheme’s stated objective. A professional fund manager runs it, and each investor owns units in proportion to what they put in.',
    f'''<h2>How a mutual fund works</h2>
<ol>
<li><strong>You invest money</strong> in a scheme, either in one go or through a <a href="/what-is-sip">SIP</a>.</li>
<li><strong>You receive units</strong> based on that day’s price per unit, called the NAV.</li>
<li><strong>The fund manager invests</strong> the pooled money according to the scheme’s objective.</li>
<li><strong>The value of your units changes</strong> as the value of the investments changes.</li>
<li><strong>You redeem units</strong> when you need the money, subject to the scheme’s terms.</li>
</ol>
<h2>A simple example</h2>
<p>Suppose you invest ₹10,000 when the NAV is ₹50. You receive 200 units. If the NAV later rises to ₹60, your units are worth ₹12,000. If it falls to ₹40, they are worth ₹8,000. These numbers are only an illustration.</p>
<h2>Main types of mutual funds</h2>
<p>SEBI groups open-ended schemes into five broad categories:</p>
<div class="scroll"><table>
<tr><th>Type</th><th>What it mainly invests in</th><th>General risk character</th></tr>
<tr><td>Equity funds</td><td>Company shares</td><td>Higher ups and downs; usually for longer periods</td></tr>
<tr><td>Debt funds</td><td>Bonds and money-market instruments</td><td>Usually steadier than equity, but not risk-free</td></tr>
<tr><td>Hybrid funds</td><td>A mix of equity and debt</td><td>Depends on the mix</td></tr>
<tr><td>Solution-oriented funds</td><td>Built for goals such as retirement or children’s needs</td><td>Depends on the portfolio; may have a lock-in</td></tr>
<tr><td>Other funds</td><td>Index funds, ETFs and funds of funds</td><td>Depends on what they track or hold</td></tr>
</table></div>
<p><a href="/elss-tax-saving-funds">ELSS funds</a> are a type of equity fund with a 3-year lock-in.</p>
<h2>What it costs</h2>
<ul>
<li><strong>Expense ratio:</strong> a yearly cost, taken from the fund’s assets, that is already reflected in the NAV.</li>
<li><strong>Exit load:</strong> a charge some schemes apply if you redeem within a set period.</li>
<li><strong>Tax:</strong> gains can be taxed when you redeem. The rules depend on the fund type and how long you held it.</li>
</ul>
<h2>The risks</h2>
<p>Mutual funds do not guarantee returns or protect your capital. Market movements, interest rates, credit quality and how long you stay invested can all affect the result. Every scheme shows a riskometer, from Low to Very High, so read that and the scheme documents before you invest.</p>
<h2>Who protects investors?</h2>
<p>Mutual funds in India are regulated by SEBI (Securities and Exchange Board of India). Your money is held by an independent custodian and trustees oversee the fund house, which is separate from your distributor. AMFI is the industry body that registers distributors. Regulation does not remove market risk.</p>
<h2>Read next</h2>
<ul><li><a href="/what-is-sip">What is a SIP?</a></li><li><a href="/mutual-fund-terms">Mutual fund terms explained</a></li><li><a href="/mutual-fund-kyc">Mutual fund KYC</a></li></ul>''',
    [
        ('Are mutual funds safe?', 'They are regulated by SEBI, but they carry market risk. The value of your investment can fall, and returns are not guaranteed. Risk varies by fund type, so check the riskometer and scheme documents.'),
        ('How much money do I need to start?', 'Many schemes take SIPs from ₹500 a month. Minimums vary by scheme.'),
        ('Can I withdraw my money at any time?', 'Open-ended schemes can generally be redeemed on any business day, but an exit load may apply, and ELSS funds have a 3-year lock-in.'),
        ('Who manages a mutual fund?', 'A fund manager at the fund house (AMC) manages the scheme according to its stated objective, under SEBI regulation.'),
    ],
)

page(
    'what-is-sip',
    'What Is a SIP? Meaning, How It Works & SIP vs Lump Sum | Moneytec',
    'What is a SIP (Systematic Investment Plan)? See how it works, rupee cost averaging with a worked example, SIP vs lump sum, step-up SIPs, and common myths.',
    'What is a SIP?',
    'A SIP, or Systematic Investment Plan, is a way to invest a fixed amount in a mutual fund at regular intervals, usually every month. It is not a separate product; it is a way of putting money into a mutual fund scheme.',
    f'''<h2>How a SIP works</h2>
<ol>
<li>You pick a scheme, an amount and a date.</li>
<li>You approve an auto-debit from your bank.</li>
<li>On each date, the amount goes to the fund house and you receive units at that day’s NAV.</li>
<li>Your units add up over time, and you can change or stop the SIP later.</li>
</ol>
<h2>Rupee cost averaging: a worked example</h2>
<p>Because the amount stays fixed, you buy more units when the NAV is lower and fewer when it is higher. Here is ₹1,000 a month for three months, with made-up NAVs:</p>
<div class="scroll"><table>
<tr><th>Month</th><th>Invested</th><th>NAV</th><th>Units bought</th></tr>
<tr><td>1</td><td>₹1,000</td><td>₹10.00</td><td>100</td></tr>
<tr><td>2</td><td>₹1,000</td><td>₹8.00</td><td>125</td></tr>
<tr><td>3</td><td>₹1,000</td><td>₹12.50</td><td>80</td></tr>
<tr><th>Total</th><th>₹3,000</th><th>Average cost ₹9.84</th><th>305</th></tr>
</table></div>
<p>The average cost per unit (₹9.84) is below the simple average of the three NAVs (₹10.17). This averages your buying price over time, but it does not guarantee a profit or prevent a loss.</p>
<h2>SIP or lump sum?</h2>
<div class="scroll"><table>
<tr><th></th><th>SIP</th><th>Lump sum</th></tr>
<tr><th>How you invest</th><td>A fixed amount at regular intervals</td><td>One larger amount at once</td></tr>
<tr><th>Suits</th><td>Regular income</td><td>Money you already have</td></tr>
<tr><th>Timing</th><td>Spread across many dates</td><td>Depends on one entry date</td></tr>
</table></div>
<p>Neither is always better. In a steadily rising market, a lump sum can do better because the money is invested for longer.</p>
<h2>Ways to run a SIP</h2>
<ul>
<li><strong>Regular SIP:</strong> the same amount each month.</li>
<li><strong>Step-up SIP:</strong> the amount rises at set intervals, for example when your income grows. Where offered, it is a simple way to keep up with a goal.</li>
<li><strong>Pause:</strong> many fund houses let you pause for a limited time. Terms vary.</li>
</ul>
<h2>Three common myths</h2>
<ul>
<li><strong>“SIPs always make money.”</strong> No. A SIP in a scheme whose value falls can show a loss.</li>
<li><strong>“I am locked in.”</strong> Usually not, except ELSS, where each instalment is locked for 3 years.</li>
<li><strong>“I need a large amount.”</strong> Many schemes start at ₹500 a month.</li>
</ul>
<h2>Next steps</h2>
<ul><li><a href="/how-to-start-sip">How to start a SIP</a></li><li><a href="/sip-calculator">SIP calculator</a></li><li><a href="/power-of-compounding">The power of compounding</a></li></ul>''',
    [
        ('What does SIP stand for?', 'SIP stands for Systematic Investment Plan: investing a fixed amount in a mutual fund at regular intervals.'),
        ('Is a SIP better than a lump sum?', 'Not always. A SIP spreads your entry over time and suits regular income, while a lump sum invests existing money at once. The result depends on how markets move.'),
        ('Is SIP return guaranteed?', 'No. Returns depend on the scheme and the market, and the value can fall as well as rise.'),
        ('Can I change my SIP amount?', 'Usually yes, by stopping the SIP and starting a new one, or using a step-up option where available.'),
    ],
)

fifteen, twentyfive, thirtyfive = [inr(sip(5000, 12, y * 12)) for y in (15, 25, 35)]
lump = lambda y: inr(100000 * 1.12 ** y)
page(
    'power-of-compounding',
    'The Power of Compounding Explained with Examples | Moneytec',
    'What is compounding? See how growth on growth works, why starting early matters, the Rule of 72, and what the Sanskrit verse on Moneytec means. Illustrations only.',
    'The power of compounding',
    'Compounding means your returns can start earning returns of their own. Over a short period the effect looks small. Over a long period, it can do more of the work than the money you put in.',
    f'''<h2>The verse on our homepage</h2>
<p lang="sa"><strong>जलबिन्दुनिपातेन क्रमशः पूर्यते घटः ।<br />स हेतुः सर्वविद्यानां धर्मस्य च धनस्य च ॥</strong></p>
<p>Drop by drop, a pot fills. In the same way, steady effort builds knowledge, virtue and wealth. It is the idea behind a monthly SIP: small amounts, repeated patiently.</p>
<h2>₹1 lakh, left alone</h2>
<p>Illustration at an assumed constant 12% a year, with no further investment:</p>
<div class="scroll"><table>
<tr><th>After</th><th>Illustrated value</th></tr>
<tr><td>10 years</td><td>{lump(10)}</td></tr>
<tr><td>20 years</td><td>{lump(20)}</td></tr>
<tr><td>30 years</td><td>{lump(30)}</td></tr>
</table></div>
<p>The second 10 years add much more than the first, because growth is now being earned on a larger amount.</p>
<h2>Why starting early matters</h2>
<p>₹5,000 a month at an assumed 12% a year:</p>
<div class="scroll"><table>
<tr><th>Years invested</th><th>You put in</th><th>Illustrated value</th></tr>
<tr><td>15</td><td>{inr(5000 * 180)}</td><td>{fifteen}</td></tr>
<tr><td>25</td><td>{inr(5000 * 300)}</td><td>{twentyfive}</td></tr>
<tr><td>35</td><td>{inr(5000 * 420)}</td><td>{thirtyfive}</td></tr>
</table></div>
<p>Try your own numbers in the <a href="/sip-calculator">SIP calculator</a>.</p>
<h2>The Rule of 72</h2>
<p>Divide 72 by a yearly return to estimate how long money takes to double. At 12%, that is about 6 years; at 6%, about 12 years. It is a rough mental shortcut.</p>
<h2>What can get in the way</h2>
<ul>
<li><strong>Stopping early:</strong> the biggest growth tends to come in the later years.</li>
<li><strong>Inflation:</strong> a larger number in future will buy less than it does today.</li>
<li><strong>Market falls:</strong> real returns are uneven and can be negative for a long time.</li>
<li><strong>Costs and tax:</strong> these reduce what stays invested.</li>
</ul>
<p class="note">All figures here assume a constant return before costs and tax. Real investments do not grow in a straight line, and these are not promises of future returns.</p>''',
    [
        ('What is compounding in simple words?', 'Earning returns on your earlier returns as well as on the money you originally invested.'),
        ('Does a mutual fund really compound?', 'In a growth option, gains stay invested and are reflected in the NAV, so they can build over time. The returns themselves vary and can be negative.'),
        ('What does the Rule of 72 tell me?', 'Divide 72 by the yearly return to estimate the years needed to double your money. For example, 12% gives about 6 years.'),
    ],
)

goal_target = 2500000 * 1.06 ** 15
goal_sip = goal_target / sip(1, 12, 180)
page(
    'goal-based-investing',
    'Goal-Based Investing: Plan a Monthly SIP for Any Goal | Moneytec',
    'What is goal-based investing? Work out the future cost of education, a home or retirement with inflation, then the monthly SIP it may take. A worked example inside.',
    'Goal-based investing',
    'Goal-based investing starts with what the money is for: a child’s education, a home, retirement. You estimate what it could cost then, how long you have, and how much to set aside. This is how our goal planner on the homepage works.',
    f'''<h2>Four steps</h2>
<ol>
<li><strong>Name the goal</strong> and today’s cost.</li>
<li><strong>Set the timeline:</strong> the year you will need the money.</li>
<li><strong>Allow for inflation:</strong> most goals cost more later.</li>
<li><strong>Work out the monthly amount,</strong> counting what you have already saved for it.</li>
</ol>
<h2>A worked example</h2>
<p>A goal that costs ₹25 lakh today, 15 years away, with 6% inflation, an assumed 12% yearly return and no existing savings:</p>
<div class="scroll"><table>
<tr><th>Step</th><th>Illustrated result</th></tr>
<tr><td>Cost today</td><td>₹25 lakh</td></tr>
<tr><td>Cost after 15 years at 6% inflation</td><td>{inr(goal_target)}</td></tr>
<tr><td>Monthly SIP at an assumed 12% a year</td><td>About ₹{round(goal_sip, -2):,.0f}</td></tr>
</table></div>
<p>Try your own goal in the <a href="/#calculator">goal planner</a>.</p>
<h2>Timeline shapes the plan</h2>
<div class="scroll"><table>
<tr><th>Timeline</th><th>Typical goals</th><th>What to think about</th></tr>
<tr><td>3–5 years</td><td>Emergency fund, short-term goals</td><td>Access to your money, exit conditions and capital risk</td></tr>
<tr><td>5–10 years</td><td>A car, a wedding, a home down-payment</td><td>Your target, timeline and a comfortable monthly amount</td></tr>
<tr><td>10–30+ years</td><td>Retirement, children’s education, long-term wealth</td><td>Affordability, inflation and your ability to stay invested</td></tr>
</table></div>
<p>These are starting points for a conversation, not product recommendations.</p>
<h2>As the goal gets closer</h2>
<p>A market fall matters more when you need the money soon. Many investors review their plan each year and consider moving towards less volatile options as the date nears, so the goal is less exposed to a late fall.</p>
<h2>Why not just invest without a goal?</h2>
<ul>
<li>It gives you a number to work towards, instead of a guess.</li>
<li>It helps you match your risk to your timeline.</li>
<li>You are less tempted to spend money that has a job to do.</li>
</ul>
<p class="note">Inflation and returns here are assumptions. Your real costs and returns will differ, so review your plan regularly.</p>''',
    [
        ('What is goal-based investing?', 'Investing for specific goals, with a target amount and date for each, rather than investing without a defined purpose.'),
        ('What inflation rate should I assume?', 'There is no single right number. Our example uses 6%, and education or healthcare costs may rise differently, so try more than one figure.'),
        ('Should I have a separate SIP for each goal?', 'Many people find that easier to track, but it is not required. What matters is knowing how much is set aside for each goal.'),
    ],
)

page(
    'what-is-life-insurance',
    'What Is Life Insurance? Term Plans, Cover & Claims Explained | Moneytec',
    'What is life insurance and how much cover might a family need? Term plans vs other policies, what to disclose, exclusions and claims, explained simply. Through Kotak Life.',
    'What is life insurance?',
    'Life insurance is a contract: you pay a premium, and if the insured person dies during the policy term, the insurer pays the agreed amount to the nominee, subject to the policy terms. It is meant to protect the people who depend on your income.',
    '''<h2>The main types</h2>
<div class="scroll"><table>
<tr><th>Type</th><th>What it does</th><th>Good to know</th></tr>
<tr><td>Term insurance</td><td>Pays a death benefit during the term</td><td>Usually gives high cover for the premium; standard plans pay nothing if you outlive the term</td></tr>
<tr><td>Endowment and savings plans</td><td>Combine cover with a maturity benefit</td><td>Higher premium; compare the benefits carefully</td></tr>
<tr><td>ULIPs</td><td>Combine cover with market-linked investment</td><td>Have charges, market risk and a lock-in</td></tr>
<tr><td>Whole-life plans</td><td>Provide cover for most of your life</td><td>Terms vary by plan</td></tr>
</table></div>
<h2>How much cover might you need?</h2>
<p>A common way to think about it, before you get a personal assessment, is to add up what your family would need:</p>
<ul>
<li>Household expenses for the years they would depend on your income</li>
<li>Outstanding loans, such as a home loan</li>
<li>Future goals, such as children’s education</li>
</ul>
<p>Then subtract existing cover and savings that could be used. The right cover also depends on affordability, health and eligibility.</p>
<h2>Before you buy</h2>
<ul>
<li><strong>Tell the insurer everything:</strong> health, smoking, occupation and existing policies. Non-disclosure can affect a claim.</li>
<li><strong>Read the exclusions:</strong> know what the policy does not cover.</li>
<li><strong>Name your nominee</strong> and tell your family that the policy exists.</li>
<li><strong>Check the premium period</strong> and what happens if you miss a payment.</li>
<li><strong>Use the free-look period:</strong> you can review the policy after you receive it and return it within the stated period, subject to its terms.</li>
</ul>
<h2>How a claim generally works</h2>
<ol>
<li>The nominee informs the insurer.</li>
<li>They submit the claim form, death certificate, policy and identity documents.</li>
<li>The insurer reviews the claim under the policy terms and decides.</li>
</ol>
<h2>How Moneytec can help</h2>
<p>Gulshan Kohli is a Kotak Life advisor (KLI61205587). You can explore life cover through Kotak Life with him, subject to eligibility, underwriting and policy terms. He helps you list existing policies, dependants, commitments and loans, and discuss cover, exclusions and affordability before you choose. Premiums go to the insurer, not to Moneytec.</p>
<p class="note">Insurance is the subject matter of solicitation. For more details on risk factors, terms and conditions, read the sales brochure and policy document carefully before concluding a sale.</p>''',
    [
        ('What is term insurance?', 'Life cover for a fixed period. If the insured person dies during the term, the insurer pays the nominee, subject to the policy terms. Standard term plans pay nothing if the person outlives the term.'),
        ('Is life insurance an investment?', 'Its main purpose is protection. Some plans include savings or market-linked features, so compare their charges, benefits and lock-ins carefully.'),
        ('Who should consider life insurance?', 'Generally anyone whose income supports others, such as a spouse, children or parents, or who has loans the family would need to repay.'),
    ],
)

page(
    'what-is-health-insurance',
    'What Is Health Insurance? Cashless, Waiting Periods & Floater Plans | Moneytec',
    'What is health insurance? Cashless vs reimbursement, individual vs family floater, waiting periods, room rent limits and co-pay, and what to check in any policy.',
    'What is health insurance?',
    'Health insurance helps pay medical costs when you are treated for a covered illness or injury, usually in hospital, up to the amount you are insured for. You pay a premium, typically every year, and the insurer pays eligible costs under the policy terms.',
    '''<h2>Why it is different from life insurance</h2>
<p>Life insurance protects your family if you die. Health insurance helps pay for treatment while you are alive. Many families look at both when planning for the unexpected.</p>
<h2>Two common ways to set up cover</h2>
<div class="scroll"><table>
<tr><th></th><th>Individual policy</th><th>Family floater</th></tr>
<tr><th>Cover</th><td>Each person has their own sum insured</td><td>The family shares one sum insured</td></tr>
<tr><th>Think about</th><td>Older members or specific health needs</td><td>One large claim can use up cover for everyone that year</td></tr>
</table></div>
<h2>How claims work</h2>
<ul>
<li><strong>Cashless:</strong> at a network hospital, the insurer settles approved costs directly with the hospital.</li>
<li><strong>Reimbursement:</strong> you pay first, then claim the eligible amount from the insurer with your bills and documents.</li>
</ul>
<h2>Terms worth understanding</h2>
<div class="scroll"><table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Sum insured</td><td>The most the policy pays in a policy year, subject to its terms</td></tr>
<tr><td>Waiting period</td><td>Time before some conditions are covered, such as pre-existing illnesses</td></tr>
<tr><td>Room rent limit</td><td>A cap on room cost; a higher room can reduce other payouts too</td></tr>
<tr><td>Co-pay</td><td>The share of an approved claim you pay yourself</td></tr>
<tr><td>Deductible</td><td>The amount you pay before the insurer pays</td></tr>
<tr><td>Network hospital</td><td>A hospital that has an arrangement with the insurer for cashless claims</td></tr>
<tr><td>Exclusions</td><td>What the policy does not cover</td></tr>
</table></div>
<h2>Before you buy</h2>
<ul>
<li>Disclose your full medical history honestly.</li>
<li>Check waiting periods, limits and sub-limits, not only the premium.</li>
<li>Check whether nearby hospitals are in the network.</li>
<li>Renew on time so that you do not lose continuity benefits.</li>
</ul>
<h2>Talking it through with Moneytec</h2>
<p>You can list your existing life and health policies and go through them with Gulshan Kohli. He is a Kotak Life advisor; ask him what is available for your situation before you decide.</p>
<p class="note">Insurance is the subject matter of solicitation. Benefits and exclusions differ by policy, so read the policy wording before you buy.</p>''',
    [
        ('What is cashless health insurance?', 'At a network hospital, the insurer settles approved treatment costs directly with the hospital, so you pay only amounts that are not covered.'),
        ('What is a waiting period?', 'A set time after buying a policy before certain conditions, such as pre-existing illnesses, are covered. It differs by policy.'),
        ('Is employer health cover enough?', 'It can help, but it usually ends when you leave the job and the amount may be limited. Check it against your family’s needs.'),
    ],
)

page(
    'mutual-fund-kyc',
    'Mutual Fund KYC: Documents, Process & Status Explained | Moneytec',
    'What is mutual fund KYC? Documents you need, how the process works online, what KYC status means, and how it differs for NRIs. It is done once and works across fund houses.',
    'Mutual fund KYC, explained',
    'KYC (Know Your Customer) is an identity and address check that you complete before investing in mutual funds in India. It is done once and works across fund houses, mostly online.',
    '''<h2>Documents you usually need</h2>
<ul>
<li>PAN</li>
<li>Aadhaar, or a passport for NRIs</li>
<li>A bank account in your name</li>
<li>A photo</li>
</ul>
<h2>How the process works</h2>
<ol>
<li><strong>Fill in your details</strong> through a fund house, a KRA or your distributor.</li>
<li><strong>Verify your identity,</strong> commonly through Aadhaar-based verification and an in-person or video check.</li>
<li><strong>Sign digitally</strong> and submit.</li>
<li><strong>The KYC Registration Agency (KRA) records</strong> your status, and fund houses can then rely on it.</li>
</ol>
<h2>What your KYC status means</h2>
<div class="scroll"><table>
<tr><th>Status</th><th>What it generally means</th></tr>
<tr><td>Validated</td><td>Your records have been verified and you can generally invest across fund houses</td></tr>
<tr><td>Registered</td><td>You can generally continue, but a fresh check may be needed for a new fund house</td></tr>
<tr><td>On hold or rejected</td><td>Something needs to be corrected before you can invest</td></tr>
</table></div>
<p>You can check your status on a KRA website using your PAN. Status names can change, so ask if you are not sure what yours means.</p>
<h2>When you may need to update it</h2>
<ul>
<li>Your name, address, mobile number or email has changed.</li>
<li>Your PAN and Aadhaar need linking.</li>
<li>You have become an NRI or have returned to India.</li>
</ul>
<h2>KYC for NRIs</h2>
<p>NRIs usually need a passport and overseas address proof along with PAN, plus FATCA details. See the <a href="/nri-mutual-fund-investment">NRI investment guide</a>.</p>
<p class="note">Never share your OTP or banking passwords with anyone for KYC, including a distributor. Moneytec never collects your investment money.</p>''',
    [
        ('Do I need KYC for each mutual fund?', 'No. KYC is done once and works across fund houses, although some status types may need an update.'),
        ('How long does mutual fund KYC take?', 'Online KYC is often quick to submit, and verification can take a few working days.'),
        ('How do I check my KYC status?', 'Enter your PAN on a KYC Registration Agency (KRA) website, or ask your distributor to check it with you.'),
    ],
)

page(
    'mutual-fund-terms',
    'Mutual Fund Terms Explained: NAV, CAGR, AMC, Exit Load & More | Moneytec',
    'A plain-English glossary of mutual fund terms: NAV, AMC, CAGR, SIP, ELSS, expense ratio, exit load, riskometer, direct vs regular plans, ARN, NRE and NRO.',
    'Mutual fund terms explained',
    'Every term you will see on Moneytec and in most scheme documents, explained in plain English.',
    '''<h2>The basics</h2>
<div class="scroll"><table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>AMC</td><td>Asset Management Company: the fund house that runs a mutual fund.</td></tr>
<tr><td>Scheme</td><td>A specific mutual fund, with its own objective and portfolio.</td></tr>
<tr><td>Unit</td><td>Your share in a scheme.</td></tr>
<tr><td>NAV</td><td>Net Asset Value: the price of one unit, usually declared each business day.</td></tr>
<tr><td>Redemption</td><td>Selling your units back to get your money.</td></tr>
<tr><td>Folio</td><td>Your account number with a fund house.</td></tr>
<tr><td>Nominee</td><td>The person you name to receive your investments if you die.</td></tr>
</table></div>
<h2>Ways of investing</h2>
<div class="scroll"><table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><a href="/what-is-sip">SIP</a></td><td>Systematic Investment Plan: a fixed amount invested regularly.</td></tr>
<tr><td>Lump sum</td><td>Investing a single larger amount at once.</td></tr>
<tr><td>STP</td><td>Systematic Transfer Plan: moving money regularly from one scheme to another.</td></tr>
<tr><td>SWP</td><td>Systematic Withdrawal Plan: withdrawing a set amount regularly.</td></tr>
<tr><td>Step-up SIP</td><td>A SIP whose amount rises at set intervals.</td></tr>
<tr><td>Growth option</td><td>Gains stay invested and are reflected in the NAV.</td></tr>
<tr><td>IDCW option</td><td>Income Distribution cum Capital Withdrawal: payouts that may be made from the scheme, and which reduce the NAV.</td></tr>
</table></div>
<h2>Returns and costs</h2>
<div class="scroll"><table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>CAGR</td><td>Compound Annual Growth Rate: a smoothed yearly growth rate between two points. Real returns are uneven.</td></tr>
<tr><td>XIRR</td><td>A yearly return calculation for several cash flows at different dates, such as a SIP.</td></tr>
<tr><td>Expense ratio</td><td>The scheme’s yearly cost as a percentage of its assets, already reflected in the NAV.</td></tr>
<tr><td>Exit load</td><td>A charge some schemes apply if you redeem within a set period.</td></tr>
<tr><td>Riskometer</td><td>A scale from Low to Very High that shows a scheme’s risk level.</td></tr>
<tr><td>Benchmark</td><td>An index that a scheme’s performance is compared with.</td></tr>
<tr><td>Inflation</td><td>The general rise in prices, which reduces what money can buy.</td></tr>
</table></div>
<h2>Fund types and plans</h2>
<div class="scroll"><table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Equity fund</td><td>Invests mainly in company shares.</td></tr>
<tr><td>Debt fund</td><td>Invests mainly in bonds and money-market instruments.</td></tr>
<tr><td>Hybrid fund</td><td>Invests in a mix of equity and debt.</td></tr>
<tr><td><a href="/elss-tax-saving-funds">ELSS</a></td><td>Equity Linked Savings Scheme: an equity fund with a 3-year lock-in.</td></tr>
<tr><td>Index fund</td><td>Aims to follow a market index.</td></tr>
<tr><td>Direct plan</td><td>You invest without a distributor; lower expense ratio.</td></tr>
<tr><td>Regular plan</td><td>You invest through a distributor, who earns commission; higher expense ratio.</td></tr>
</table></div>
<h2>People, rules and accounts</h2>
<div class="scroll"><table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>SEBI</td><td>Securities and Exchange Board of India: the regulator for mutual funds.</td></tr>
<tr><td>AMFI</td><td>Association of Mutual Funds in India: the industry body that registers distributors.</td></tr>
<tr><td>ARN</td><td>AMFI Registration Number: a distributor’s registration. Gulshan Kohli’s is ARN-105840.</td></tr>
<tr><td>IRDAI</td><td>Insurance Regulatory and Development Authority of India: the insurance regulator.</td></tr>
<tr><td><a href="/mutual-fund-kyc">KYC</a></td><td>Know Your Customer: the identity check you complete before investing.</td></tr>
<tr><td>PAN</td><td>Permanent Account Number: your income-tax ID, needed to invest.</td></tr>
<tr><td><a href="/nri-mutual-fund-investment">NRI</a></td><td>Non-Resident Indian.</td></tr>
<tr><td>NRE account</td><td>A rupee account generally used for money earned outside India.</td></tr>
<tr><td>NRO account</td><td>A rupee account generally used for income earned in India.</td></tr>
<tr><td>FATCA</td><td>A tax-residency declaration required when you invest.</td></tr>
</table></div>''',
    [
        ('What is NAV in a mutual fund?', 'Net Asset Value is the price of one unit of a scheme. It is calculated from the value of the scheme’s assets, less liabilities, divided by the number of units.'),
        ('What is the difference between direct and regular plans?', 'In a direct plan you invest without a distributor and the expense ratio is lower. In a regular plan a distributor earns commission and the expense ratio is higher.'),
        ('What is CAGR?', 'Compound Annual Growth Rate is the smoothed yearly rate that takes a value from its start to its end. Actual yearly returns can be very different.'),
    ],
)

page(
    'portfolio-review',
    'Mutual Fund Portfolio Review: What to Check | Moneytec',
    'What is a mutual fund portfolio review? What to check: goals, overlap, costs, risk, nominee and KYC details, and how to avoid costly switches. A checklist from Moneytec.',
    'Mutual fund portfolio review',
    'A portfolio review is a regular check that your SIPs and funds still fit your goals, timeline and comfort with risk. It often means organising what you have, not replacing everything.',
    '''<h2>What gets checked</h2>
<ul>
<li><strong>Goals:</strong> is each investment linked to a purpose and date?</li>
<li><strong>Progress:</strong> are you on track at your current amount?</li>
<li><strong>Risk:</strong> does the overall mix still suit you, especially as a goal gets close?</li>
<li><strong>Overlap:</strong> do several funds hold much the same investments?</li>
<li><strong>Number of funds:</strong> can you track what you hold?</li>
<li><strong>Costs:</strong> expense ratios and any exit loads.</li>
<li><strong>Performance in context:</strong> against its benchmark and similar funds over longer periods, not just the last few months.</li>
<li><strong>Paperwork:</strong> nominee, KYC, bank and contact details.</li>
</ul>
<h2>What to bring</h2>
<ul>
<li>A Consolidated Account Statement (CAS), which shows your mutual fund holdings in one place</li>
<li>Your list of SIPs</li>
<li>Your goals and when you need the money</li>
<li>Any large upcoming expenses</li>
</ul>
<h2>How often?</h2>
<p>Many people review once a year, and also when something big changes, such as a new job, marriage, a child, a home loan or a move abroad. Checking every week usually makes market noise feel more important than it is.</p>
<h2>Before you switch anything</h2>
<p>Switching is treated as selling one fund and buying another. It can trigger tax and an exit load, and ELSS instalments cannot be redeemed until their 3-year lock-in ends. A recent dip alone is not always a reason to change.</p>
<h2>How Moneytec helps</h2>
<p>Gulshan Kohli can go through your existing SIPs and funds with you and organise them around your goals, timeline and comfort with risk. Any decision and payment stays with you, through the fund house.</p>''',
    [
        ('How many mutual funds should I hold?', 'There is no fixed number. It should be few enough to track and varied enough for your goals, so check for overlap between funds.'),
        ('How often should I review my mutual funds?', 'Many people review about once a year, and whenever their life or goals change significantly.'),
        ('What is a Consolidated Account Statement?', 'A CAS is a single statement of your mutual fund holdings and transactions across fund houses, available through the registrars and depositories.'),
    ],
)

page(
    'how-moneytec-works',
    'How Moneytec Works: What We Do, Fees & Your Money’s Safety | Moneytec',
    'What Moneytec does and does not do: one-to-one guidance from Gulshan Kohli (ARN-105840) on SIPs, life cover and NRI investing, how we are paid, and where your money goes.',
    'How Moneytec works',
    'Moneytec is the practice of Gulshan Kohli, an AMFI-registered mutual fund distributor (ARN-105840) and Kotak Life advisor (KLI61205587) in Rohini, New Delhi. It starts with a conversation and moves only when you are ready.',
    '''<h2>What we do</h2>
<ul>
<li>Help you start a <a href="/what-is-sip">SIP</a> and complete <a href="/mutual-fund-kyc">KYC</a></li>
<li>Help you plan a monthly amount for a <a href="/goal-based-investing">goal</a></li>
<li>Go through your existing investments in a <a href="/portfolio-review">portfolio review</a></li>
<li>Discuss <a href="/nri-mutual-fund-investment">NRI investing</a> and what is available for your country</li>
<li>Explore <a href="/what-is-life-insurance">life cover</a> through Kotak Life</li>
</ul>
<h2>How it goes, step by step</h2>
<ol>
<li><strong>Talk:</strong> message or call Gulshan. You speak with him personally.</li>
<li><strong>Understand:</strong> your goal, timeline, income, commitments and comfort with risk.</li>
<li><strong>Review the details:</strong> costs, risks and scheme or policy documents.</li>
<li><strong>You decide:</strong> nothing moves without your approval.</li>
<li><strong>Set up:</strong> KYC, then your payment goes directly to the fund house or insurer.</li>
<li><strong>Keep in touch:</strong> review as your life and goals change.</li>
</ol>
<h2>What we do not do</h2>
<ul>
<li>We do not collect your investment or premium. Your money never touches Moneytec.</li>
<li>We do not promise returns. Illustrations on this site are not forecasts.</li>
<li>We do not ask for your OTP or banking passwords.</li>
<li>Nothing is invested or booked from this website; the forms only prepare a WhatsApp message for you to send.</li>
</ul>
<h2>Where your money goes</h2>
<p>Straight from your bank account to the fund house (AMC) or the insurer. Mutual fund units and policies are in your name, subject to the product terms.</p>
<h2>How we are paid</h2>
<p>As an AMFI-registered distributor and Kotak Life advisor, Moneytec earns commission from fund houses and the insurer, as regulated by SEBI, AMFI and IRDAI. There is no separate advisory fee, and this is shared upfront.</p>
<h2>Check us yourself</h2>
<p>Look up ARN-105840 on the <a href="https://www.amfiindia.com/locate-distributor" rel="noopener">AMFI distributor locator</a>. Read more about <a href="/mutual-fund-distributor-rohini-delhi">Gulshan Kohli</a>.</p>''',
    [
        ('Does Moneytec charge a fee?', 'There is no separate advisory fee. Moneytec earns commission from fund houses and the insurer, as regulated by SEBI, AMFI and IRDAI, and shares this upfront.'),
        ('Does my money go to Moneytec?', 'No. It goes directly from your bank account to the fund house or insurer, and the units or policies are in your name.'),
        ('Can I invest through the website?', 'No. Nothing is invested here. The website helps you explore, and its forms open a WhatsApp message for you to send.'),
    ],
)

HUB = [
    ('Start here', [('what-is-mutual-fund', 'What is a mutual fund?', 'How it works, NAV, types, costs and risks'), ('what-is-sip', 'What is a SIP?', 'How it works, with a worked example'), ('power-of-compounding', 'The power of compounding', 'Growth on growth, and our verse'), ('mutual-fund-terms', 'Mutual fund terms explained', 'NAV, CAGR, AMC, exit load and more')]),
    ('Plan and invest', [('goal-based-investing', 'Goal-based investing', 'From a goal to a monthly amount'), ('how-to-start-sip', 'How to start a SIP', 'Six steps and the documents'), ('sip-calculator', 'SIP calculator', 'Try your own numbers'), ('elss-tax-saving-funds', 'ELSS tax-saving funds', 'The 3-year lock-in and tax rules'), ('mutual-fund-kyc', 'Mutual fund KYC', 'Documents, process and status'), ('portfolio-review', 'Portfolio review', 'What to check, and when')]),
    ('NRI investing', [('nri-mutual-fund-investment', 'NRI mutual fund investment', 'NRE, NRO, documents, US and Canada')]),
    ('Protect your family', [('what-is-life-insurance', 'What is life insurance?', 'Types of cover, and how claims work'), ('what-is-health-insurance', 'What is health insurance?', 'Cashless, waiting periods and floaters')]),
    ('About Moneytec', [('how-moneytec-works', 'How Moneytec works', 'What we do, how we are paid, where your money goes'), ('mutual-fund-distributor-rohini-delhi', 'Mutual fund distributor in Rohini', 'About Gulshan Kohli, ARN-105840')]),
]
hub_body = ''.join(f'<h2>{html.escape(t)}</h2>\n<ul class="hub">' + ''.join(f'<li><a href="/{s}"><b>{html.escape(n)}</b><span>{html.escape(d)}</span></a></li>' for s, n, d in items) + '</ul>\n' for t, items in HUB)
page(
    'learn',
    'Learn: Mutual Funds, SIPs, Insurance & NRI Investing Explained | Moneytec',
    'Plain-English guides from Moneytec: what is a mutual fund, what is a SIP, compounding, goal planning, KYC, ELSS, NRI investing, life and health insurance.',
    'Learn the basics, in plain English',
    'Everything on Moneytec, explained: what it means, how it works, and what to check before you decide.',
    hub_body,
    [],
    schema_type='CollectionPage',
)


# a helpful "not found" page that keeps visitors on the site; never indexed
(OUT / '404.html').write_text("""<!doctype html>
<html lang="en-IN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#FBF8F3" />
<meta name="robots" content="noindex" />
<title>Page not found | Moneytec</title>
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="preload" href="/fonts/inter-latin-v1.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/instrument-serif-latin-normal-v1.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/instrument-serif-latin-italic-v1.woff2" as="font" type="font/woff2" crossorigin />
<style>@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/inter-latin-v1.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/inter-latin-ext-v1.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-normal-v1.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-ext-normal-v1.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-italic-v1.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-latin-ext-italic-v1.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}</style>
<link rel="stylesheet" href="/guide-v5.css" />
</head>
<body class="is-hub">
<div class="sky" aria-hidden="true"><i></i><i></i><i></i></div>
<header class="top"><div class="top-in"><a href="/" aria-label="Moneytec home"><img src="/brand/moneytec-logo-light.svg" alt="Moneytec" width="174" height="32" /></a><nav aria-label="Main"><a class="tlink" href="/learn">Learn</a></nav></div></header>
<div class="hero">
<h1>This page has <em>moved.</em></h1>
<p class="lede">We could not find that address. The homepage and our guides are a good place to continue.</p>
<p class="btns"><a class="btn" href="/">Go to Moneytec</a> <a class="btn ghost" href="/learn">Browse the guides</a></p>
</div>
</body>
</html>
""", encoding='utf-8')

# the whole library as one plain file for AI assistants, built from the same text as the pages
FULL_HEAD = """# Moneytec: full guide text

> Moneytec (https://moneytec.in) is the practice of Gulshan Kohli, an AMFI-registered mutual fund distributor (ARN-105840) and Kotak Life advisor (KLI61205587) in Rohini, New Delhi, India. Contact: +91 91367 92367, invest@moneytec.in.

This is general information, not personal investment, tax or legal advice. """ + DISCLAIMER + "\n"
chunks = [FULL_HEAD]
for slug, title, text in PAGES:
    if slug == 'learn':
        continue
    clean = html.unescape(re.sub(r'[ \t]+', ' ', text))
    clean = '\n'.join(line.strip() for line in clean.splitlines() if line.strip())
    chunks.append(f'\n## {title}\nSource: {SITE}/{slug}\n\n{clean}\n')
(OUT / 'llms-full.txt').write_text(''.join(chunks), encoding='utf-8')
print('wrote', len(GUIDES), 'guides to', OUT)
