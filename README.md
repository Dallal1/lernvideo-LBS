# VideoManager – Lernvideos

واجهة ألمانية بـ OpenUI5 وXML وTypeScript، وخادم VB.NET / ASP.NET Core لحفظ فيديوهات حقيقية وتشغيلها وحذفها.

## التشغيل على Mac أثناء التطوير

تحتاج إلى Node.js 22 أو أحدث و.NET 8 SDK. في حال استخدام Node.js المحلي الموجود على هذا الجهاز، نفّذ داخل جذر المشروع في **كل Terminal جديد**:

```sh
export PATH="$PWD/.tools/node/bin:$PATH"
```

ثبّت الحزم عند إعداد المشروع لأول مرة:

```sh
npm ci
```

افتح نافذتَي Terminal في جذر المشروع:

**الأولى: خادم الفيديوهات**

```sh
npm run backend
```

يعمل على `http://localhost:5080`. يمكن تشغيله مباشرة أيضًا:

```sh
dotnet run --project backend/Lernvideo.Api.vbproj
```

**الثانية: واجهة التطوير**

```sh
npm start
```

افتح **http://localhost:8081/index.html#/videos**. يستخدم المشروع 8081 لأن nginx قد يشغل 8080 على جهازك. اترك النافذتين تعملان؛ `Ctrl+C` يوقف كل خادم. احفظ تعديلات الواجهة ثم حدّث المتصفح، ولا تحتاج إلى build بعد كل تعديل أثناء التطوير.

## رفع فيديو وتشغيله وحذفه

1. اضغط **Hochladen** واختر ملف MP4 أو WebM حتى 256 MB.
2. المتصفح يقرأ مدة الفيديو ويستخرج صورة حقيقية منه تلقائيًا؛ لا تحتاج إلى اختيار صورة.
3. أدخل **Titel** و**Thema** و**Sprache** و**Erscheinungsjahr**، ثم اضغط **Speichern**. يظهر تقدّم الرفع.
4. يظهر الفيديو في القائمة. **Ansehen** يفتح مشغّلًا يدعم التشغيل والإيقاف والتقديم والصوت وملء الشاشة.
5. **Löschen** يطلب تأكيدًا قبل حذف الفيديو وبياناته ومعاينته نهائيًا. **Abbrechen** يلغي الحذف.

لا توجد فيديوهات تجريبية تلقائيًا. الصور القديمة في `webapp/videos/images` لم تعد مستخدمة في القائمة. صور البطاقات الجديدة تأتي من الفيديوهات المرفوعة نفسها. البحث واللغة والموضوع تعمل مع القائمة الحقيقية.

الامتداد وحده لا يضمن توافق الترميز: استخدم MP4 بترميز H.264/AAC أو WebM يدعمه متصفحك. يتم فحص قدرة المتصفح على قراءة الفيديو قبل الرفع، ولا يحدث تحويل صيغ على الخادم. تتطلب النسخة الحالية مدة معروفة وموجبة لا تتجاوز 24 ساعة.

## أين تُحفظ الملفات؟

```text
backend/uploads/<id>/
├── video.mp4 أو video.webm
├── thumbnail.png
└── metadata.json
```

الملفات تبقى بعد تحديث الصفحة وإعادة تشغيل الخادم. الحذف دائم، لذا احتفظ بنسخة احتياطية من `backend/uploads`. هذا المجلد مستثنى من Git. استخدم خادمًا واحدًا لكل مجلد تخزين.

يمكن تغيير مكان التخزين بمسار مطلق عبر متغير البيئة `Storage__Path`، مثلًا لقرص خارجي على Raspberry Pi. أثناء الرفع يستعمل ASP.NET Core أيضًا مجلد النظام المؤقت لتخزين الملفات الكبيرة؛ تأكد من توفر مساحة كافية هناك وفي مجلد التخزين. ينشر الخادم الفيديو في القائمة بعد اكتمال كتابة الملفات، وينظّف الرفع الفاشل. إذا انقطع التيار فجأة قد تبقى مجلدات `.pending-*` أو `.deleted-*` مخفية تحتاج إلى تنظيف يدوي بعد التحقق منها وإيقاف الخادم.

لا يوجد تسجيل دخول بحسب متطلبات المشروع؛ كل من يصل إلى الخادم يستطيع الرفع والحذف. الإعداد الافتراضي يستمع على localhost فقط. واجهة التطوير مسموحة من `http://localhost:8081` و`http://127.0.0.1:8081`.

## تشغيل الواجهة والخادم معًا من عنوان واحد

```sh
npm run build
npm run backend
```

افتح **http://localhost:5080/index.html#/videos**. الخادم يقدّم ملفات `dist` والـ API من العنوان نفسه. في هذا الوضع أعد `npm run build` بعد تعديلات الواجهة. المكتبات والصور اللازمة للتطبيق تُخدَم محليًا بعد البناء.

## الملفات الجديدة والمهمة

- `backend/Program.vb`: تشغيل الخادم وملفات الواجهة وإعدادات الطلبات.
- `backend/Controllers/VideosController.vb`: قائمة الفيديوهات والرفع والتشغيل والمعاينة والحذف.
- `backend/Services/VideoStore.vb`: التخزين على القرص والتحقق من الملفات.
- `backend/Models/Video.vb`: بيانات الفيديو وحقول الرفع.
- `webapp/videos/views/Upload.fragment.xml`: نافذة الرفع.
- `webapp/videos/views/Playback.fragment.xml`: نافذة المشغّل.
- `webapp/videos/controls/Player.ts`: مشغّل HTML5 داخل OpenUI5.
- `webapp/videos/services/api.ts`: الاتصال بالخادم.
- `webapp/videos/services/prepareVideo.ts`: قراءة المدة واستخراج إطار من الفيديو.

## API

| الطلب | الوظيفة |
| --- | --- |
| `GET /api/videos` | قائمة البيانات المحفوظة |
| `POST /api/videos` | رفع multipart: videoFile, thumbnailFile, title, topic, language, year, durationSeconds |
| `GET /api/videos/{id}/stream` | الفيديو مع دعم HTTP Range للتقديم والتأخير |
| `GET /api/videos/{id}/thumbnail` | المعاينة المأخوذة من الفيديو |
| `DELETE /api/videos/{id}` | حذف الفيديو وملفاته |

ترسل الواجهة تلقائيًا الترويسة `X-VideoManager-Request: 1` للرفع والحذف. يتحقق الخادم من حجم الملف وامتداده وتوقيع بدايته وحقول البيانات؛ هذا ليس فحصًا كاملًا لكل ترميزات الفيديو. المدة والمعاينة ينشئهما المتصفح.

## التحقق والنشر لاحقًا

```sh
npm run typecheck
npm run build
dotnet build backend/Lernvideo.Api.vbproj
```

يستهدف الخادم .NET 8 لأنه المثبت على Mac. **ينتهي دعم .NET 8 في 10 نوفمبر 2026**؛ حدّث المشروع إلى .NET 10 LTS مع إعادة الاختبار قبل الاستخدام طويل الأمد. [سياسة دعم Microsoft](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core).

بعد بناء الواجهة يمكن نشر الخادم مع ملفاتها لنظام Pi 64 بت:

```sh
dotnet publish backend/Lernvideo.Api.vbproj -c Release -r linux-arm64 --self-contained true -o artifacts/pi
```

انسخ مجلد النشر إلى Pi واستخدم مجلد تخزين دائمًا منفصلًا عن ملفات التطبيق. من مجلد النشر شغّل:

```sh
chmod +x Lernvideo.Api
Storage__Path=/home/pi/lernvideo-data ./Lernvideo.Api --urls http://0.0.0.0:5080
```

استبدل مسار التخزين بمسار يناسب اسم المستخدم لديك. استخدم `linux-arm` بدل `linux-arm64` إذا كان النظام 32 بت. يلزم نظام Linux مدعوم ومكتبات .NET الأصلية، حتى مع self-contained. لم يُختبر على Raspberry Pi فعليًا.
