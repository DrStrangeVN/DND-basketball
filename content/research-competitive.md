# Competitive research — basketball knowledge hubs (2026-10-06)

Quick survey for the DND Basketball build, per the commissioner's request to study
best-in-class hubs while keeping the Neumorphism + lightweight + learning-progression
direction. Only structural/UX ideas worth borrowing — all content on DND must be
original wording (see SCHEMA.md).

## Sites reviewed

1. **basketballforcoaches.com** — Strongest "learning progression" model found.
   Practice plans organized by AGE FIRST (U6/U8/U10…/HS), each with a time-boxed
   session structure (e.g. 30-min: warm-up game 5' → skill block 8' → …).
   Borrow: age-first entry point + time-boxed session templates. Note their
   "Drills & Games for Kids" library is filterable by skill and player count.

2. **coachingtoolbox.net / coachesclipboard.net** — Deepest coverage of plays,
   offenses, defenses with text + diagrams. Both are text-heavy walls of content —
   exactly what the brief's "Diagrams > long explanations" rule should avoid.
   Borrow: breadth of play taxonomy (offensive actions, BLOBs/SLOBs, zone offenses)
   as a taxonomy checklist for DND's tactics hub; present it diagram-first.

3. **Breakthrough Basketball (breakthroughbasketball.com)** — Best conversion of
   knowledge into structured products: eBooks organized by topic, email-courses as
   drip learning paths. Borrow: "learning path as a product" — DND's paths/<slug>.json
   should feel like a guided course with clear level gating, not a tag list.

4. **Hoops U (hoopsu.com)** — Classic playbook + drills + coaching-tips structure;
   good example of hub navigation: Plays / Drills / Coaching tips / Training programs.
   Borrow: top-level nav simplicity; our 10 hubs map well onto this pattern.

5. **FIBA Europe Coaching Website** — Community layer: coaches upload their own
   drills/plays, message boards. Future expansion idea for DND v2 (user-submitted
   drills), not v1.

6. **InTheLab+ / good-drills.com (subscription platforms)** — They monetize via
   structured video libraries + Discord Q&A + breakdown videos (film study).
   Borrow: film-study concept — DND's film.json + basketball-iq hub covers this
   with text/diagrams; keep v1 focused.

## Structural takeaways for DND (v1 scope)

- **Age-first + level-first filtering is the killer feature** youth basketball sites
  share; DND's schema already has ages/level on every item — surface filters early
  in hub UX, not buried.
- **Every drill page on good hubs shows: players needed, equipment, duration,
  intensity, progression/regression** — SCHEMA.md already covers all of these.
  Make progression/regression prominent in the card UI (it's what coaches scan).
- **Diagrams are the differentiator**: none of the reviewed hubs does clean
  interactive court diagrams well. DND's SVG diagram model (court-vision.json) is
  the moat — invest in making diagrams beautiful per the Neumorphism system.
- **Global search with autocomplete** (brief §4) is rare on competitor sites;
  shipping it well on day one makes DND feel like an "OS", not a blog.
- **Glossary**: coaching sites constantly link terminology inline. DND's glossary.json
  should power hover/click tooltips across articles — cheap to add, big knowledge
  payoff ("Knowledge > decoration").

## Out of scope for v1 (explicitly skip)

- Video hosting (link YouTube, don't host), user accounts, community uploads,
  ecommerce/courses, live stats.

Sources: web research 2026-10-06 (basketballforcoaches.com, coachingtoolbox.net,
coachesclipboard.net, breakthroughbasketball.com, hoopsu.com, basketballengland.co.uk).
