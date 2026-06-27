# AURATEA - Website trà sữa

Website giới thiệu và bán trà sữa AURATEA tại Đà Nẵng, được xây dựng bằng Next.js.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở trình duyệt tại:

```bash
http://localhost:3000
```

## Lệnh thường dùng

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Cấu trúc chính

- `app/MilkTeaPage.tsx`: giao diện chính của website.
- `app/milktea.css`: style cho website trà sữa.
- `public/milktea-assets`: hình ảnh sản phẩm.

## Nội dung website

Website hiện có các phần:

- Trang đầu giới thiệu sản phẩm nổi bật.
- Thực đơn trà sữa.
- Tùy chỉnh độ ngọt, đá, size và topping.
- Giỏ hàng dạng drawer.
- Câu chuyện nguyên liệu.
- Ưu đãi mẫu.
- Đánh giá khách hàng demo.
- Khu vực giao hàng tại Đà Nẵng.
- Form đặt hàng nhanh.
- Cửa hàng và bản đồ.
- Thành viên tích dấu.
- CTA cuối trang.

## Thay thông tin cửa hàng

Trong `app/MilkTeaPage.tsx`, tìm và thay các placeholder:

- `[ĐỊA CHỈ CỬA HÀNG]`
- `[SỐ ĐIỆN THOẠI]`
- `[SO_DIEN_THOAI_ZALO]`
- `[LINK GOOGLE MAPS]`
- `[GIỜ MỞ CỬA]`
- `[THÔNG TIN CHỖ ĐỂ XE]`

Ảnh sản phẩm nằm trong `public/milktea-assets`.
