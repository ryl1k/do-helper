"use client";
import { useEffect, useState } from "react";

export const LOCALES = ["uk", "en"] as const;
export type Locale = (typeof LOCALES)[number];

const KEY = "locale";

const STRINGS = {
  uk: {
    "brand.suffix": "helper",
    "nav.quiz": "Тест",
    "nav.search": "Пошук",
    "nav.profile": "Профіль",
    "nav.login": "Увійти",
    "nav.logout": "Вийти",

    "home.title.1": "Дослідження",
    "home.title.2": "операцій",
    "home.subtitle": "Обери тему, склади тест, побач, що пропустив.",
    "home.cta.quiz.title": "Скласти тест",
    "home.cta.quiz.body": "Обери теми, відповідай на випадкові питання, побач свій бал і помилки.",
    "home.cta.search.title": "Пошук та перегляд",
    "home.cta.search.body": "Перегляд усіх питань з фільтрами та правильними відповідями.",
    "home.cta.start": "Почати",
    "home.cta.open": "Відкрити",
    "home.topics": "Теми",
    "home.browseAll": "переглянути всі →",

    "quiz.title": "Тест",
    "quiz.subtitle": "Обери теми та кількість питань.",
    "quiz.topics": "Теми",
    "quiz.howMany": "Скільки питань",
    "quiz.count.custom": "інша",
    "quiz.selectAll": "усі",
    "quiz.selectNone": "жодної",
    "quiz.start": "Старт",
    "quiz.startEligible": "з {n} доступних",
    "quiz.exit": "← вийти",
    "quiz.score": "бали",
    "quiz.multipleCorrect": "Кілька правильних — обери всі підходящі.",
    "quiz.submit": "Відповісти",
    "quiz.next": "Далі →",
    "quiz.finish": "Завершити",
    "quiz.done": "Готово",
    "quiz.correctOf": "{c} з {n} правильно",
    "quiz.newQuiz": "Новий тест",
    "quiz.sameAgain": "Той самий ще раз",
    "quiz.reviewWrong": "Перегляд {n} помилок",
    "quiz.weakestTopics": "Найслабші теми",
    "quiz.allCorrect": "Усі питання правильно — браво!",
    "quiz.correct": "правильно",
    "quiz.yourPick": "твій вибір",

    "search.title": "Пошук",
    "search.placeholder": "Шукати питання або варіант…",
    "search.shown": "{n} показано",
    "search.showAnswers": "показати відповіді",
    "search.hide": "Сховати",
    "search.reveal": "Показати",
    "search.noMatches": "Нічого не знайдено",
    "search.tryAnother": "Спробуй інший пошук або фільтр.",
    "search.noAnswerBadge": "немає відповіді",

    "profile.title": "Профіль",
    "profile.anonymous": "Anonymous",
    "profile.setName": "встановити ім'я",
    "profile.editName": "змінити ім'я",
    "profile.save": "зберегти",
    "profile.stats.quizzes": "Тести",
    "profile.stats.questions": "Питання",
    "profile.stats.accuracy": "Точність",
    "profile.noQuizzes": "Тестів поки немає.",
    "profile.firstQuiz": "Скласти перший тест →",
    "profile.byTopic": "Точність за темами",
    "profile.recent": "Нещодавні тести",
    "profile.clearHistory": "очистити історію",
    "profile.allTopics": "усі теми",
    "profile.loggedInAs": "Увійшов як",
    "profile.guest": "Не увійшов — статистика лише локально.",
    "profile.signIn": "Увійти",

    "login.title": "Вхід",
    "login.subtitle": "Введи email — надішлемо посилання для входу.",
    "login.email": "Email",
    "login.send": "Надіслати посилання",
    "login.sent": "Перевір пошту — там посилання для входу.",
    "login.error": "Не вдалося надіслати: ",

    "category.other": "Інше",
    "category.all": "Усі",
  },
  en: {
    "brand.suffix": "helper",
    "nav.quiz": "Quiz",
    "nav.search": "Search",
    "nav.profile": "Profile",
    "nav.login": "Log in",
    "nav.logout": "Log out",

    "home.title.1": "Operations",
    "home.title.2": "research",
    "home.subtitle": "Pick a topic, take a quiz, see what you got wrong.",
    "home.cta.quiz.title": "Take a quiz",
    "home.cta.quiz.body": "Pick topics, answer random questions, see your score and review mistakes.",
    "home.cta.search.title": "Search & browse",
    "home.cta.search.body": "Read every question, filter by topic, see the correct answers.",
    "home.cta.start": "Start",
    "home.cta.open": "Open",
    "home.topics": "Topics",
    "home.browseAll": "browse all →",

    "quiz.title": "Quiz",
    "quiz.subtitle": "Choose your topics and how many questions you want.",
    "quiz.topics": "Topics",
    "quiz.howMany": "How many questions",
    "quiz.count.custom": "custom",
    "quiz.selectAll": "all",
    "quiz.selectNone": "none",
    "quiz.start": "Start",
    "quiz.startEligible": "of {n} eligible",
    "quiz.exit": "← exit",
    "quiz.score": "score",
    "quiz.multipleCorrect": "Multiple correct — select all that apply.",
    "quiz.submit": "Submit",
    "quiz.next": "Next →",
    "quiz.finish": "Finish",
    "quiz.done": "Done",
    "quiz.correctOf": "{c} of {n} correct",
    "quiz.newQuiz": "New quiz",
    "quiz.sameAgain": "Same settings again",
    "quiz.reviewWrong": "Review {n} wrong",
    "quiz.weakestTopics": "Weakest topics",
    "quiz.allCorrect": "All correct — nice!",
    "quiz.correct": "correct",
    "quiz.yourPick": "your pick",

    "search.title": "Search",
    "search.placeholder": "Search question text or options…",
    "search.shown": "{n} shown",
    "search.showAnswers": "show answers",
    "search.hide": "Hide",
    "search.reveal": "Reveal",
    "search.noMatches": "No matches",
    "search.tryAnother": "Try a different search or topic filter.",
    "search.noAnswerBadge": "no recorded answer",

    "profile.title": "Profile",
    "profile.anonymous": "Anonymous",
    "profile.setName": "set name",
    "profile.editName": "edit name",
    "profile.save": "save",
    "profile.stats.quizzes": "Quizzes",
    "profile.stats.questions": "Questions",
    "profile.stats.accuracy": "Accuracy",
    "profile.noQuizzes": "No quizzes yet.",
    "profile.firstQuiz": "Take your first quiz →",
    "profile.byTopic": "Accuracy by topic",
    "profile.recent": "Recent quizzes",
    "profile.clearHistory": "clear history",
    "profile.allTopics": "all topics",
    "profile.loggedInAs": "Logged in as",
    "profile.guest": "Not signed in — your stats stay on this device.",
    "profile.signIn": "Sign in",

    "login.title": "Log in",
    "login.subtitle": "Enter your email and we'll send you a sign-in link.",
    "login.email": "Email",
    "login.send": "Send link",
    "login.sent": "Check your inbox for the sign-in link.",
    "login.error": "Couldn't send: ",

    "category.other": "Інше", // category labels stay in Ukrainian (source material)
    "category.all": "All",
  },
} as const satisfies Record<Locale, Record<string, string>>;

type Key = keyof (typeof STRINGS)["uk"];

function read(): Locale {
  if (typeof window === "undefined") return "uk";
  const saved = window.localStorage.getItem(KEY) as Locale | null;
  if (saved === "uk" || saved === "en") return saved;
  // Default to Ukrainian regardless of browser locale.
  return "uk";
}

export function useT() {
  const [locale, setLocaleState] = useState<Locale>("uk");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(read());
    setMounted(true);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    window.localStorage.setItem(KEY, l);
    document.documentElement.setAttribute("lang", l);
    // Reload so server-rendered <html lang> and any cached translations refresh.
    // Cheap; pages re-fetch from /api/questions which is cached server-side.
    window.dispatchEvent(new Event("localechange"));
  }

  function t(key: Key, vars?: Record<string, string | number>): string {
    const dict = STRINGS[locale];
    let s: string = dict[key] ?? STRINGS.uk[key] ?? String(key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(v));
      }
    }
    return s;
  }

  return { t, locale, setLocale, mounted };
}

// Listen for changes from other components.
export function useLocaleSync() {
  const [, force] = useState(0);
  useEffect(() => {
    function onChange() { force((x) => x + 1); }
    window.addEventListener("localechange", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("localechange", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
}
