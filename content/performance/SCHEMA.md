# Performance Article Schema — DND Basketball Phase 2

Mọi bài performance nằm trong `content/performance/*.json` (mỗi hub một prefix slug, vd `ap-...`, `rec-...`, `nut-...`, `hyd-...`, `ip-...`).

## TypeScript interface

```ts
interface PerfStep { title: string; detail: string }

interface PerformanceVi {
  title: string; description: string;
  whatItDevelops: string[]; whyBasketball: string[];
  howTo: PerfStep[]; coachingPoints: string[]; commonMistakes: string[];
  setsReps: string; basketballTransfer: string; progression: string[];
  tags: string[];
}

interface PerformanceArticle {
  id: string;            // "perf-ap-vertical-jump-basics"
  slug: string;          // "ap-vertical-jump-basics"
  hub: "athletic-performance" | "recovery" | "nutrition" | "hydration" | "injury-prevention";
  category: string;      // kebab-case, vd "strength", "post-game-recovery", "game-day"
  subcategory: string;   // kebab-case, vd "lower-body-strength"
  title: string; description: string;
  level: "beginner" | "intermediate" | "advanced";
  positions: string[];   // subset của ["guard","wing","big","all"]
  trainingPhase: string[]; // subset của ["off-season","pre-season","in-season","game-day","recovery-day"]
  goal: string[];        // subset của ["jump-higher","get-faster","get-stronger","move-better","conditioning","explosive"]
  duration: string;      // "10-15 min" (giữ tiếng Anh ngắn gọn, VI dịch trong vi.duration? KHÔNG — duration là display string, để EN "10–15 min", vi "10–15 phút")
  equipment: string[];
  whatItDevelops: string[];
  whyBasketball: string[];
  howTo: PerfStep[];
  coachingPoints: string[];
  commonMistakes: string[];
  setsReps: string;
  basketballTransfer: string;
  progression: string[];   // 3 bước Beginner → Intermediate → Advanced
  relatedTopics: string[]; // slug các bài liên quan, KHUYẾN KHÍCH cross-hub
  video?: { title: string; url: string };
  tags: string[];
  references?: string[];
  dateUpdated: "2026-10-06";
  medicalDisclaimer?: boolean; // true cho recovery + injury-prevention có nội dung nhạy cảm
  vi: PerformanceVi & { duration: string };
}
```

## Hub metadata (dùng cho landing, nav, hub pages)

| hub | EN name | VI name | icon (Lucide) |
|---|---|---|---|
| athletic-performance | Athletic Performance | Thể lực bóng rổ | Dumbbell |
| recovery | Recovery | Hồi phục | RefreshCw / BatteryCharging |
| nutrition | Nutrition | Dinh dưỡng | Salad / Apple |
| hydration | Hydration | Bù nước | Droplets |
| injury-prevention | Injury Prevention | Phòng ngừa chấn thương | ShieldPlus |

## Routes

- `/performance` — landing
- `/performance/[hub]` — hub page
- `/performance/[hub]/[slug]` — article page
- URL helper: `performanceUrl(hub, slug)` → `/performance/${hub}/${slug}`

## Quy tắc nội dung

- Song ngữ EN/VI, tuân thủ VI-STYLE-GUIDE.md tuyệt đối.
- Recovery + Injury Prevention: trang bài có `medicalDisclaimer` hiển thị disclaimer nhỏ (EN+VI).
- Không host video — chỉ YouTube embed lazy-load.
- Ưu tiên SVG/diagram/timeline/checklist, không ảnh stock.
- Nguồn uy tín cho nutrition/hydration/recovery/injury: FIBA, NBA/NBA Academy, USA Basketball, IOC, ACSM, NSCA.
- Không chẩn đoán y tế, không liều supplement cá nhân hóa, không hứa "ngừa chấn thương hoàn toàn".
