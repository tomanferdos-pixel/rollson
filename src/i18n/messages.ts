export type Locale = "en" | "fr" | "es" | "ru" | "ar";

export const LOCALE_OPTIONS: Array<{ code: Locale; short: string; name: string; flag: string }> = [
  { code: "en", short: "EN", name: "English", flag: "🇬🇧" },
  { code: "fr", short: "FR", name: "Français", flag: "🇫🇷" },
  { code: "es", short: "ES", name: "Español", flag: "🇪🇸" },
  { code: "ru", short: "RU", name: "Русский", flag: "🇷🇺" },
  { code: "ar", short: "AR", name: "العربية", flag: "🇲🇦" },
];

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && LOCALE_OPTIONS.some((l) => l.code === value);
}

type Dict = Record<string, string>;

const en: Dict = {
  "nav.status": "Status",
  "nav.inbox": "Inbox",
  "common.rights": "All Rights Reserved to",
  "main.badge": "Secure inbox lookup",
  "main.title": "Rollson Mail Query",
  "main.intro": "Enter your CD key to open the linked inbox and copy recent verification codes.",
  "main.checking": "Checking...",
  "main.openInbox": "Open Inbox",
  "main.queryFailed": "Query failed.",
  "main.networkError": "Network error. Please try again later.",
  "main.copyFailed": "Copy failed. Please copy manually.",
  "main.ready": "Ready",
  "main.readyText": "Enter a valid CD key to check its authorized inbox.",
  "main.noRecentMail": "No recent mail",
  "main.noRecentMailText":
    "No inbox messages were found inside the active query window.",
  "main.mailbox": "Mailbox",
  "main.window": "Window",
  "main.messages": "Messages",
  "main.keyExpires": "Key Expires",
  "main.daysLeft": "Days Left",
  "main.verificationCode": "Verification Code",
  "main.copy": "Copy",
  "main.copied": "Copied",
  "main.noBodyPreview": "No body preview available.",
  "main.viewFullEmail": "View full email",
  "main.hideFullEmail": "Hide full email",
  "main.originalEmailHint": "Original email view. Links open in a new tab.",
  "main.noFullEmail": "No full email content available.",
  "status.systemStatus": "System status",
  "status.overview": "System overview",
  "status.online": "Online",
  "status.version": "Version",
  "status.mailWindow": "Mail Window",
  "status.rateLimit": "Rate Limit",
  "status.checkedAt": "Checked At",
  "status.healthApi": "Health API",
  "status.runtime": "Runtime",
  "status.minutes": "{value} minutes",
  "status.requestsPerMinute": "{value} requests per minute",
  "status.nextServer": "Next.js server",
};

const ru: Dict = {
  ...en,
  "nav.status": "Статус",
  "nav.inbox": "Почта",
  "common.rights": "Все права принадлежат",
  "main.badge": "Безопасный доступ к почте",
  "main.title": "Rollson — запрос кодов",
  "main.intro": "Введите CD-ключ, чтобы открыть связанный ящик и скопировать коды подтверждения.",
  "main.checking": "Проверка...",
  "main.openInbox": "Открыть почту",
  "main.queryFailed": "Запрос не удался.",
  "main.networkError": "Ошибка сети. Повторите попытку позже.",
  "main.copyFailed": "Не удалось скопировать. Скопируйте вручную.",
  "main.ready": "Готово",
  "main.readyText": "Введите действительный CD-ключ для доступа к почтовому ящику.",
  "main.noRecentMail": "Нет свежей почты",
  "main.noRecentMailText":
    "В активном окне запроса писем в ящике не найдено.",
  "main.mailbox": "Ящик",
  "main.window": "Окно",
  "main.messages": "Письма",
  "main.keyExpires": "Ключ до",
  "main.daysLeft": "Осталось дней",
  "main.verificationCode": "Код подтверждения",
  "main.copy": "Копировать",
  "main.copied": "Скопировано",
  "main.noBodyPreview": "Превью недоступно.",
  "main.viewFullEmail": "Показать письмо",
  "main.hideFullEmail": "Скрыть письмо",
  "main.originalEmailHint": "Оригинальный вид письма. Ссылки открываются в новой вкладке.",
  "main.noFullEmail": "Полный текст письма недоступен.",
  "status.systemStatus": "Статус системы",
  "status.overview": "Обзор системы",
  "status.online": "Онлайн",
  "status.version": "Версия",
  "status.mailWindow": "Окно писем",
  "status.rateLimit": "Лимит запросов",
  "status.checkedAt": "Проверено",
  "status.healthApi": "Health API",
  "status.runtime": "Среда",
  "status.minutes": "{value} минут",
  "status.requestsPerMinute": "{value} запросов в минуту",
  "status.nextServer": "Сервер Next.js",
};

const fr: Dict = {
  ...en,
  "nav.status": "État",
  "nav.inbox": "Boîte",
  "common.rights": "Tous droits réservés à",
  "main.badge": "Consultation sécurisée",
  "main.title": "Rollson — requête mail",
  "main.intro": "Saisissez votre clé CD pour ouvrir la boîte liée et copier les codes récents.",
  "main.checking": "Vérification...",
  "main.openInbox": "Ouvrir la boîte",
  "main.ready": "Prêt",
  "main.readyText": "Saisissez une clé CD valide pour consulter la boîte autorisée.",
  "main.noRecentMail": "Aucun mail récent",
  "main.noRecentMailText":
    "Aucun message n'a été trouvé dans la fenêtre de requête active.",
  "main.verificationCode": "Code de vérification",
  "main.copy": "Copier",
  "main.copied": "Copié",
  "status.systemStatus": "État du système",
  "status.online": "En ligne",
};

const es: Dict = {
  ...en,
  "nav.status": "Estado",
  "nav.inbox": "Bandeja",
  "common.rights": "Todos los derechos reservados a",
  "main.badge": "Consulta segura",
  "main.title": "Rollson — consulta de correo",
  "main.intro": "Introduce tu clave CD para abrir el buzón vinculado y copiar códigos recientes.",
  "main.checking": "Comprobando...",
  "main.openInbox": "Abrir bandeja",
  "main.ready": "Listo",
  "main.readyText": "Introduce una clave CD válida para consultar su bandeja autorizada.",
  "main.noRecentMail": "Sin correo reciente",
  "main.noRecentMailText":
    "No se encontraron mensajes en la ventana de consulta activa.",
  "main.verificationCode": "Código de verificación",
  "main.copy": "Copiar",
  "main.copied": "Copiado",
  "status.systemStatus": "Estado del sistema",
  "status.online": "En línea",
};

const ar: Dict = {
  ...en,
  "nav.status": "الحالة",
  "nav.inbox": "البريد",
  "common.rights": "جميع الحقوق محفوظة لـ",
  "main.badge": "استعلام آمن عن البريد",
  "main.title": "Rollson — استعلام البريد",
  "main.intro": "أدخل مفتاح CD لفتح صندوق البريد المرتبط ونسخ رموز التحقق.",
  "main.checking": "جارٍ التحقق...",
  "main.openInbox": "فتح البريد",
  "main.ready": "جاهز",
  "main.readyText": "أدخل مفتاح CD صالحًا للوصول إلى صندوق البريد المصرح به.",
  "main.noRecentMail": "لا بريد حديث",
  "main.noRecentMailText":
    "لم يتم العثور على رسائل داخل نافذة الاستعلام النشطة.",
  "main.verificationCode": "رمز التحقق",
  "main.copy": "نسخ",
  "main.copied": "تم النسخ",
  "status.systemStatus": "حالة النظام",
  "status.online": "متصل",
};

export const MESSAGES: Record<Locale, Dict> = { en, fr, es, ru, ar };

export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const raw = MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key;
  if (!vars) return raw;
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), raw);
}
