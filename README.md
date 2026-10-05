# lernvideo-LBS

واجهة OpenUI5 بملفات XML وTypeScript.

## التشغيل على Mac

افتح Terminal من **جذر المشروع**، حيث يوجد `package.json`.

تحتاج إلى Node.js 22 أو أحدث. إذا كنت تستخدم النسخة المحلية التي وُضعت في `.tools/node` على هذا الجهاز، فعّلها في كل نافذة Terminal جديدة:

```sh
export PATH="$PWD/.tools/node/bin:$PATH"
```

إذا كان Node.js مثبتًا على النظام، فلا تحتاج إلى هذا الأمر. تحقق ثم ثبّت الحزم وشغّل الموقع:

```sh
node --version
npm ci
npm run typecheck
npm start
```

افتح http://localhost:8080. يتطلب التثبيت والتشغيل الأول اتصالًا بالإنترنت لتنزيل مكتبات OpenUI5 المحددة في `ui5.yaml`. لإيقاف الخادم اضغط `Ctrl+C`.

لإنشاء نسخة البناء:

```sh
npm run build
```

## حل خطأ Cannot find module 'sap/ui/core/mvc/Controller'

الاستيراد صحيح. تعريفات TypeScript تأتي من حزمة `@openui5/types` المسجّلة في `package.json`؛ والمكتبات التي تعمل في المتصفح يديرها UI5 CLI بحسب `ui5.yaml`. لا تحتاج إلى تثبيت `Controller` منفصلًا. [مرجع OpenUI5 وTypeScript](https://ui5.github.io/typescript/).

عند فحص هذه النسخة كانت الحزم غير مثبتة (`node_modules` غير موجود). الأمر `npm ci` يثبّت الإصدارات المحددة في `package-lock.json` بما فيها تعريفات OpenUI5.

إذا نجح `npm run typecheck` وبقي الخط الأحمر داخل VS Code:

1. افتح مجلد المشروع كاملًا، وليس ملف TypeScript وحده.
2. افتح ملف `.ts`، ثم اضغط `Cmd+Shift+P` واختر `TypeScript: Select TypeScript Version` ثم `Use Workspace Version`.
3. نفّذ `TypeScript: Restart TS Server` من لوحة الأوامر.

إعداد `.vscode/settings.json` يشير إلى TypeScript الموجود في المشروع. المجلدان `node_modules` و`.tools` محليان ولا يدخلان Git؛ على جهاز آخر ثبّت Node.js ثم نفّذ `npm ci`.
