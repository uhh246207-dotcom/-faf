# PSD Template Editor

## Gioi thieu (Introduction)

He thong cho phep khach hang chinh sua template PSD thong qua giao dien web don gian, de hieu.

- Admin upload PSD template va khai bao cac layer cho phep chinh sua.
- Khach hang thay doi text va thay anh PNG tren giao dien editor truc quan.
- Preview cap nhat ngay lap tuc (real-time) khi khach chinh sua.
- Preview co watermark de bao ve ban quyen; anh xuat cuoi cung khong co watermark.
- He thong token: khach chi bi tru token khi bam "Xuat anh PNG".
- Tinh nang AI quick-edit cho phep khach ra lenh bang ngon ngu tu nhien (vi du: "doi mau chu gia thanh do").

## Yeu cau he thong (System Requirements)

- PHP >= 8.4
- Composer >= 2.8
- MySQL >= 8.0 (hoac SQLite cho moi truong development)
- Node.js >= 18 (neu can build Tailwind CSS, ban demo dung CDN)
- GD extension (cho mock rendering)
- Queue driver: database (tich hop san, khong can Redis)

## Cai dat (Installation)

```bash
git clone <repo-url>
cd psd-template-editor
composer install
cp .env.example .env
php artisan key:generate

# Cau hinh database trong .env
# DB_CONNECTION=mysql
# DB_DATABASE=psd_editor
# DB_USERNAME=root
# DB_PASSWORD=

php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

Truy cap ung dung tai: http://localhost:8000

## Tai khoan Admin (Admin Account)

- Email mac dinh tu seeder: `admin@admin.com`
- Mat khau: `password`
- Truy cap trang admin tai: `/admin`
- Admin co the quan ly templates, layers, users, tokens, render history

## Tao Template (Creating Templates)

1. Dang nhap voi tai khoan admin -> vao `/admin/templates`
2. Click "Tao Template Moi"
3. Dien thong tin:
   - **name**: ten template
   - **description**: mo ta
   - **token_price**: so token can de xuat anh
4. Upload PSD file (file nguon cho Adobe API rendering)
5. Upload preview image (PNG/JPG cua template de hien thi tren web)
6. Dat status la Active
7. Luu lai

## Khai bao Layer (Declaring Editable Layers)

Sau khi tao template:

1. Vao trang Layers cua template do
2. Click "Them Layer Moi"
3. Dien thong tin:
   - **layer_name**: ten layer chinh xac trong PSD (vi du: `EDIT_TITLE_TEXT`)
   - **field_key**: key duy nhat cho field nay (vi du: `title`)
   - **type**: `text` hoac `image`
   - **label**: nhan hien thi cho khach (vi du: "Tieu de")
   - **required**: khach co bat buoc phai dien hay khong
   - **max_length**: gioi han ky tu cho loai text
   - **accepted_file_types**: vi du `png,jpg,jpeg,webp` cho loai image
   - **sort_order**: thu tu hien thi trong form

## Cau hinh vi tri Preview (Preview Position Configuration)

Moi layer can cau hinh vi tri hien thi tren web preview:

- **preview_x**: vi tri ngang (pixel tinh tu trai)
- **preview_y**: vi tri doc (pixel tinh tu tren)
- Doi voi text: **font_size** (px), **font_color** (#hex), **text_align** (left/center/right)
- Doi voi image: **preview_width**, **preview_height** (pixel)
- **z_index**: thu tu xep chong (so lon hon = hien thi phia tren)

> **Luu y**: Cac vi tri nay chi dung cho WEB PREVIEW. Khi render PSD that, he thong su dung vi tri layer goc trong file PSD.

## AI Quick-Edit (Chinh sua nhanh bang AI)

- Cau hinh `OPENAI_API_KEY` va `OPENAI_MODEL` trong `.env`
- Khach hang co the go lenh nhu "doi mau chu gia thanh do"
- AI phan tich lenh va tra ve cac hanh dong co cau truc
- Chi cac layer co `allow_ai_edit=true` moi bi thay doi
- Cac layer bat dau bang "LOCK_" khong bao gio bi AI chinh sua
- Cac hanh dong duoc phep: `update_text`, `update_style`, `update_image_adjustment`, `update_transform`
- Quyen AI cho moi layer: `allow_color_edit`, `allow_position_edit`, `allow_size_edit`, `allow_effect_edit`

## Che do Mock (Mock Mode)

Khi `ADOBE_MOCK=true` trong `.env`:

- Khong goi Adobe API that
- Mock rendering su dung GD library de ghep text/image len preview image
- Toan bo flow van hoat dong day du: tao render, tru token, xu ly, download
- Phu hop cho development va demo
- Neu `OPENAI_API_KEY` khong duoc cau hinh, AI commands tra ve mock responses

### Cach test mock mode:

1. Dat `ADOBE_MOCK=true` trong `.env`
2. Tao template voi preview image
3. Them cac layer voi vi tri preview
4. Dang nhap voi tai khoan khach hang
5. Chinh sua text va upload anh
6. Preview cap nhat ngay tren web
7. Click "Xuat anh PNG"
8. Token bi tru
9. Mock render tao anh composite
10. Download ket qua

## He thong Token (Token System)

- Moi template co `token_price` rieng
- Admin co the cong token cho bat ky user nao tai `/admin/users`
- Khi khach xuat PNG:
  - He thong kiem tra so du token
  - Tru token bang DB transaction (atomic)
  - Tao ban ghi `token_transaction`
  - Dispatch render job vao queue
- Neu render that bai:
  - Token duoc tu dong hoan tra (refund)
  - Thong bao loi hien thi cho khach hang

## Chay Queue (Queue Setup)

```bash
# Trong .env
QUEUE_CONNECTION=database

# Chay queue worker
php artisan queue:work

# Hoac cho development voi auto-restart
php artisan queue:listen
```

Render jobs duoc xu ly boi queue worker. Neu khong chay queue worker, cac render se o trang thai "pending" mai.

## Luong khach hang (Customer Flow)

1. Khach hang dang ky / dang nhap
2. Xem danh sach template tai `/templates`
3. Click vao template de mo editor
4. Thay preview ben trai, form chinh sua ben phai
5. Go text - preview cap nhat ngay lap tuc
6. Upload anh PNG nhan vat - preview cap nhat ngay lap tuc
7. Preview luon hien thi watermark overlay
8. Khi hai long, click "Xuat anh PNG - mat X token"
9. He thong tru token va tao render job
10. Polling hien thi tien trinh render
11. Khi hoan tat, nut download xuat hien
12. Anh PNG tai ve KHONG co watermark

## Cau truc thu muc (Directory Structure)

```
app/
  Http/Controllers/       - Tat ca controllers (Admin/, Auth/, main)
  Http/Middleware/        - AdminMiddleware
  Http/Requests/          - Form request validation
  Jobs/                   - RenderPsdJob
  Models/                 - User, Template, TemplateLayer, Render, TokenTransaction
  Providers/              - AppServiceProvider
  Services/               - PsdRenderService, AdobeRenderService, MockRenderService,
                            AiEditorCommandService, TokenService
bootstrap/                - App bootstrap (Laravel 11 style)
config/                   - Configuration files
database/
  migrations/             - All database migrations
  seeders/                - AdminSeeder, DatabaseSeeder
public/
  css/editor.css          - Editor custom styles
  js/editor.js            - Alpine.js editor component
resources/views/
  layouts/                - app.blade.php, admin.blade.php
  auth/                   - login, register
  admin/                  - Dashboard, templates, layers, users, renders
  templates/              - Customer index, editor
routes/
  web.php                 - All routes
storage/                  - File uploads, logs
```

## API Routes Reference

```
GET  /login                          - Trang dang nhap
POST /login                          - Xu ly dang nhap
POST /logout                         - Dang xuat
GET  /register                       - Trang dang ky
POST /register                       - Xu ly dang ky

GET  /templates                      - Gallery template
GET  /templates/{slug}               - Editor template
POST /templates/{template}/render    - Gui yeu cau render
GET  /renders/{render}/status        - Poll trang thai render (JSON)
GET  /renders/{render}/download      - Download anh PNG da render

POST /ai/editor-command              - Lenh AI quick-edit

GET  /admin                          - Admin dashboard
GET  /admin/templates                - Quan ly template
POST /admin/templates                - Tao template
GET  /admin/templates/{id}/edit      - Chinh sua template
PUT  /admin/templates/{id}           - Cap nhat template
DELETE /admin/templates/{id}         - Xoa template
GET  /admin/templates/{id}/layers    - Quan ly layers
POST /admin/templates/{id}/layers    - Tao layer
GET  /admin/users                    - Quan ly users
POST /admin/users/{id}/add-tokens    - Cong token cho user
GET  /admin/renders                  - Lich su render
```

## Cau hinh Adobe API that (Real Adobe API Configuration)

Khi san sang cho production:

```env
ADOBE_MOCK=false
ADOBE_CLIENT_ID=your_client_id
ADOBE_CLIENT_SECRET=your_client_secret
ADOBE_STORAGE_URL=your_storage_endpoint
```

AdobeRenderService se:
- Upload file PSD len Adobe storage
- Sua cac text layer theo layer_name
- Thay the Smart Object image layers
- Export PNG cuoi cung
- Download va luu ket qua

## Deployment Notes

- Doi `FILESYSTEM_DISK` sang `s3` de dung S3/R2 cloud storage
- Cau hinh AWS/R2 credentials trong `.env`
- Dung process manager (Supervisor) cho queue worker trong production
- Dat `APP_ENV=production`, `APP_DEBUG=false`
- Chay cac lenh cache:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## License

MIT
