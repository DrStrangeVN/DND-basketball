# Danang Dragons Learn

Website chính thức: https://learn.danangdragons.com/
Source chuẩn: https://github.com/DrStrangeVN/DND-basketball

Ứng dụng Next.js 16 xuất tĩnh bằng `output: "export"`; Cloudflare Workers Static Assets phục vụ trang tĩnh; Worker `worker/learn.mjs` cung cấp CMS trên D1 `dnd-learn-content`. 807 mục từ `content/` là dữ liệu khởi tạo; nội dung được chỉnh trong admin chính sẽ nằm trong D1, không ghi ngược tự động vào JSON trên GitHub. Tiến trình, bookmark, quiz và nhật ký tập luyện hiện lưu bằng localStorage trên trình duyệt theo domain. Video Film Room dùng YouTube embeds.

## Quản trị tập trung

Mở https://danangdragons.com/admin/#learn bằng tài khoản quản trị website chính:

- Owner có toàn quyền; cấp ứng dụng **Learn** cùng quyền `learn.read`, `learn.edit`, `learn.publish` cho từng nhân viên. Hai vai trò mẫu là Learn Editor và Learn Publisher.
- Biên tập viên chọn loại nội dung, chọn bài hoặc tạo mới, sửa văn bản và **Lưu nháp**. Bản nháp không xuất hiện trên API công khai, tìm kiếm hay website.
- Người có quyền xuất bản tải lại bản nháp đã lưu và chọn **Xuất bản bản đã lưu**. **Ẩn nội dung** gỡ khỏi web và tìm kiếm; không xóa dữ liệu.
- **Lịch sử phiên bản** giữ 50 bản mỗi mục. Khôi phục tạo bản nháp; cần duyệt xuất bản lại. Hai người cùng sửa sẽ gặp thông báo xung đột, cần tải lại.
- Owner có thể **Xuất snapshot Learn** để tải JSON gồm bản nháp và bản công khai. Snapshot Learn riêng với backup của website chính. Chưa có nhập/khôi phục toàn bộ snapshot từ UI.
- Trường phổ biến có form; dữ liệu chi tiết (bước tập luyện, lộ trình, sơ đồ) chỉnh trong JSON nâng cao. Slug/hub/nhóm của bài có sẵn được giữ để bảo toàn URL.
- Bài mới xuất hiện trong tìm kiếm và `/content`; bài cũ giữ URL. Những thẻ chọn lọc tĩnh trên trang chủ vẫn cần cập nhật source nếu muốn đổi tuyển chọn. Trang đang mở nhận nội dung xuất bản trong tối đa khoảng một phút hoặc khi tải lại.
- Logo, màu thương hiệu và liên hệ đọc cấu hình công khai của website chính. Tiến trình học, bookmark và nhật ký cá nhân vẫn dùng localStorage.

CMS dùng Service Bindings `MAIN` và secret `LEARN_BRIDGE_SECRET` trùng với Worker website chính; không cấp token Cloudflare cho trình duyệt. D1 giới hạn 2000 mục, mỗi payload 120000 ký tự, mỗi request 180KB; ghi dữ liệu tối đa 40 thao tác/phút/tài khoản.

## Cập nhật source và dữ liệu ban đầu

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

## D1 và kiểm thử

Khởi tạo D1 trống bằng `node scripts/seed-learn-cms.mjs /tmp/learn-seed.sql`, sau đó `npx wrangler d1 execute dnd-learn-content --remote --file /tmp/learn-seed.sql`. Script dùng INSERT OR IGNORE, không ghi đè nội dung đã sửa qua CMS. Luôn xuất backup trước thao tác database.

Kiểm thử tích hợp: đặt clone `DanangDragons-Web` cạnh repo này, chạy `node --test tests/learn-cms.test.mjs`; kiểm tra quyền draft/publish, CAS, lịch sử, ẩn bài và bảo mật API. `scripts/learn-deploy-qa.cjs` kiểm tra public routes/mobile sau deploy. Secret dùng Wrangler secret, không commit trong source.
