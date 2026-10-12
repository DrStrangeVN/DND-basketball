# Danang Dragons Learn

Website chính thức: https://learn.danangdragons.com/
Source chuẩn: https://github.com/DrStrangeVN/DND-basketball

Ứng dụng Next.js 16 xuất tĩnh bằng `output: "export"`; Cloudflare Workers Static Assets phục vụ HTML, JavaScript, CSS và dữ liệu tìm kiếm. Nội dung nằm trong `content/`; không cần chuyển database cho bản này. Tiến trình, bookmark, quiz và nhật ký tập luyện hiện lưu bằng localStorage trên trình duyệt theo domain. Video Film Room dùng YouTube embeds.

## Cập nhật nội dung

- Bài học: `content/articles/`.
- Bài tập, workout, lộ trình và video: các thư mục tương ứng trong `content/`.
- Giao diện: `app/`, `components/`; bản dịch: `lib/`.
- `npm run build` kiểm tra nội dung, tạo search index và sitemap trước khi build.
- URL canonical, sitemap và structured data dùng `https://learn.danangdragons.com`.

## Build và triển khai

```sh
npm ci
npm run build
npx wrangler deploy --dry-run
```

Push thay đổi lên GitHub, review/merge vào `main` **trước khi deploy production**:

```sh
git switch main
git pull --ff-only
npm ci
npm run deploy:cloudflare
```

Wrangler dùng account được chỉ định trong `wrangler.jsonc`, Worker `danang-dragons-learn`, Custom Domain `learn.danangdragons.com`. Cần đăng nhập Cloudflare có quyền cập nhật Worker và cấu hình domain. Không commit token/mật khẩu.

`npm run preview:cloudflare` phục vụ bản `out/` đã build để kiểm tra route tĩnh, 404 và điều hướng. Kiểm tra homepage, bài học sâu, search, Film Room, quiz, lưu bookmark và mobile sau deploy.

## Đối chiếu bàn giao 12/10/2026

704 file trong `dnd-basketball-source.zip` trùng byte với GitHub tại commit `36f14be`. Hai file chỉ có trong ZIP là file tự sinh `next-env.d.ts` và `tsconfig.tsbuildinfo`. Bản ZIP deploy là output đã build; production được build lại từ source repo để có URL chính thức và cấu hình Cloudflare có thể tái tạo.

## Thương hiệu

Logo chính thức và favicon dùng cùng artwork với website Danang Dragons, lưu trong `public/brand/` và `app/favicon.ico`. Thông tin liên hệ ở footer; tên thương hiệu và metadata được cập nhật trong `app/`, `components/`, `lib/i18n.tsx`.
