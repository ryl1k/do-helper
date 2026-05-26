"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LOCALES = ["uk", "en"] as const;
export type Locale = (typeof LOCALES)[number];

const KEY = "locale";

// Descriptive copy. No marketing tone.
const STRINGS = {
  uk: {
    "brand.suffix": "study",
    "nav.quiz": "Тест",
    "nav.search": "Каталог",
    "nav.profile": "Профіль",
    "nav.login": "Увійти",
    "nav.logout": "Вийти",

    "home.title.1": "Дослідження",
    "home.title.2": "операцій",
    "home.subtitle": "520 питань з 9 тем, з правильними відповідями.",
    "home.cta.quiz.title": "Тест",
    "home.cta.quiz.body": "Випадкові питання з вибраних тем.",
    "home.cta.search.title": "Каталог",
    "home.cta.search.body": "Усі питання з фільтрами та правильними відповідями.",
    "home.cta.start": "Почати",
    "home.cta.open": "Відкрити",
    "home.topics": "Теми",
    "home.browseAll": "переглянути всі →",
    "home.signIn.title": "Зберегти прогрес",
    "home.signIn.body": "Без входу — твоя статистика залишається лише на цьому пристрої. Увійди, щоб бачити свій прогрес скрізь.",
    "home.signIn.cta": "Увійти",
    "home.disclaimer.before": "Дані питань взято з Crowdly. Якщо виникли проблеми — перегляньте ",
    "home.disclaimer.link": "Q/A сторінку",
    "home.disclaimer.after": ".",

    "quiz.title": "Тест",
    "quiz.subtitle": "Обери теми та кількість питань.",
    "quiz.topics": "Теми",
    "quiz.howMany": "Скільки питань",
    "quiz.suggestions": "Швидкий вибір:",
    "quiz.max": "Доступно: {n}",
    "quiz.selectAll": "усі",
    "quiz.selectNone": "жодної",
    "quiz.start": "Старт",
    "quiz.startEligible": "з {n} доступних",
    "quiz.exit": "← вийти",
    "quiz.score": "бали",
    "quiz.multipleCorrect": "Кілька правильних — обери всі підходящі.",
    "quiz.submit": "Відповісти",
    "quiz.previous": "← Назад",
    "quiz.next": "Далі →",
    "quiz.finish": "Завершити",
    "quiz.done": "Готово",
    "quiz.correctOf": "{c} з {n} правильно",
    "quiz.newQuiz": "Новий тест",
    "quiz.sameAgain": "Той самий ще раз",
    "quiz.reviewWrong": "Перегляд {n} помилок",
    "quiz.weakestTopics": "Найслабші теми",
    "quiz.allCorrect": "Усі питання правильно.",
    "quiz.correct": "правильно",
    "quiz.yourPick": "твій вибір",
    "review.you": "Ваша відповідь",
    "review.correct": "Правильна відповідь",
    "review.noAnswer": "без вибору",

    "search.title": "Каталог",
    "search.placeholder": "Шукати питання або варіант…",
    "search.shown": "Показано {n} з {total}",
    "search.showAnswers": "показати відповіді",
    "search.hide": "Сховати відповіді",
    "search.reveal": "Показати відповіді",
    "search.noMatches": "Нічого не знайдено",
    "search.tryAnother": "Спробуй інший пошук або фільтр.",
    "search.noAnswerBadge": "немає відповіді",

    "profile.title": "Профіль",
    "profile.anonymous": "Без імені",
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
    "profile.guest": "Статистика лише на цьому пристрої.",
    "profile.guestExplain": "Увійди, щоб зберегти прогрес і бачити статистику з усіх пристроїв.",
    "profile.signIn": "Увійти",

    "login.title": "Вхід",
    "login.subtitle": "Прогрес зберігається лише після входу. Без нього статистика залишається на одному пристрої.",
    "login.email": "Email",
    "login.send": "Надіслати посилання",
    "login.sent": "Перевір пошту — там посилання для входу.",
    "login.error": "Не вдалося надіслати: ",
    "login.google": "Увійти через Google",
    "login.or": "або",

    "category.other": "Інше",
    "category.all": "Усі",

    "nav.faq": "Q/A",

    "profile.expand": "розгорнути",
    "profile.collapse": "згорнути",
    "profile.wrong": "помилок",
    "profile.wrongOf": "{w} з {n} помилок",
    "profile.noWrongInQuiz": "Усі правильно в цьому тесті.",
    "profile.statusCorrect": "правильно",
    "profile.statusWrong": "неправильно",
    "profile.showAll": "Показати усі",
    "profile.wrongOnly": "Лише помилки",

    "faq.title": "Q/A",
    "faq.subtitle": "Про звідки питання і як долучитися.",
    "faq.source.title": "Звідки питання",
    "faq.source.crowdly": "Питання взяті з Crowdly — chrome extensionу який зберігає дані. Деякі можуть бути неточними або неправильними.",
    "faq.source.vns": "Також використано матеріали з ВНС.",
    "faq.source.disclaimer": "Якщо знайшов помилку — пиши по формі нижче",
    "faq.contribute.title": "Долучитися",
    "faq.contribute.body": "Проєкт open-source. Чекаю на пул реквести тут:",
    "faq.contribute.repo": "github.com/ryl1k/oistudy",
    "faq.support.title": "Підтримка та зворотній зв'язок",
    "faq.support.telegram": "Напиши @ryl1k у Telegram",
    "faq.support.or": "або",
    "faq.support.issues": "створи issue на GitHub",

    "picker.title": "Обери предмет",
    "picker.subtitle": "Кожен предмет — окремий банк питань і тем.",
    "picker.empty": "Поки немає жодного предмета.",
    "picker.createFirst": "Додати перший →",
    "picker.questions": "питань",
    "picker.heroTagline": "Готуйся до іспитів у зручному форматі. Один профіль — кілька предметів.",
    "picker.statsQuestions": "Питань",
    "picker.statsTopics": "Тем",
    "picker.statsAccuracy": "Твоя точність",
    "picker.notStarted": "Ще не починав",
    "picker.startCta": "Почати",
    "picker.totalSubjects": "{n} {n, plural, one {предмет} few {предмети} many {предметів} other {предмета}}",
    "picker.summarySubjects": "предметів",
    "picker.summaryQuestions": "питань усього",
    "nav.allSubjects": "Усі предмети",
    "profile.subjectFilter": "Предмет",
    "profile.allSubjects": "Усі",
    "profile.unknownSubject": "невідомий предмет",
  },
  en: {
    "brand.suffix": "study",
    "nav.quiz": "Quiz",
    "nav.search": "Catalog",
    "nav.profile": "Profile",
    "nav.login": "Log in",
    "nav.logout": "Log out",

    "home.title.1": "Operations",
    "home.title.2": "research",
    "home.subtitle": "520 questions across 9 topics, with correct answers.",
    "home.cta.quiz.title": "Quiz",
    "home.cta.quiz.body": "Random questions from selected topics.",
    "home.cta.search.title": "Catalog",
    "home.cta.search.body": "All questions with filters and correct answers.",
    "home.cta.start": "Start",
    "home.cta.open": "Open",
    "home.topics": "Topics",
    "home.browseAll": "browse all →",
    "home.signIn.title": "Save your progress",
    "home.signIn.body": "Without an account your stats stay on this device only. Sign in to see your progress everywhere.",
    "home.signIn.cta": "Sign in",
    "home.disclaimer.before": "All question data is from Crowdly. If you experience any issues, please check the ",
    "home.disclaimer.link": "Q/A page",
    "home.disclaimer.after": ".",

    "quiz.title": "Quiz",
    "quiz.subtitle": "Pick topics and how many questions.",
    "quiz.topics": "Topics",
    "quiz.howMany": "How many questions",
    "quiz.suggestions": "Suggestions:",
    "quiz.max": "Available: {n}",
    "quiz.selectAll": "all",
    "quiz.selectNone": "none",
    "quiz.start": "Start",
    "quiz.startEligible": "of {n} available",
    "quiz.exit": "← exit",
    "quiz.score": "score",
    "quiz.multipleCorrect": "Multiple correct — select all that apply.",
    "quiz.submit": "Submit",
    "quiz.previous": "← Back",
    "quiz.next": "Next →",
    "quiz.finish": "Finish",
    "quiz.done": "Done",
    "quiz.correctOf": "{c} of {n} correct",
    "quiz.newQuiz": "New quiz",
    "quiz.sameAgain": "Same settings again",
    "quiz.reviewWrong": "Review {n} wrong",
    "quiz.weakestTopics": "Weakest topics",
    "quiz.allCorrect": "All correct.",
    "quiz.correct": "correct",
    "quiz.yourPick": "your pick",
    "review.you": "Your answer",
    "review.correct": "Correct answer",
    "review.noAnswer": "no answer",

    "search.title": "Catalog",
    "search.placeholder": "Search question text or options…",
    "search.shown": "Showing {n} of {total}",
    "search.showAnswers": "show answers",
    "search.hide": "Hide answers",
    "search.reveal": "Show answers",
    "search.noMatches": "No matches",
    "search.tryAnother": "Try a different search or topic filter.",
    "search.noAnswerBadge": "no recorded answer",

    "profile.title": "Profile",
    "profile.anonymous": "No name",
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
    "profile.guest": "Stats are stored on this device only.",
    "profile.guestExplain": "Sign in to save your progress and see stats across all your devices.",
    "profile.signIn": "Sign in",

    "login.title": "Log in",
    "login.subtitle": "Your progress is saved only when you're signed in. Otherwise stats stay on a single device.",
    "login.email": "Email",
    "login.send": "Send link",
    "login.sent": "Check your inbox for the sign-in link.",
    "login.error": "Couldn't send: ",
    "login.google": "Continue with Google",
    "login.or": "or",

    "category.other": "Інше",
    "category.all": "All",

    "nav.faq": "Q/A",

    "profile.expand": "expand",
    "profile.collapse": "collapse",
    "profile.wrong": "wrong",
    "profile.wrongOf": "{w} of {n} wrong",
    "profile.noWrongInQuiz": "All correct in this quiz.",
    "profile.statusCorrect": "correct",
    "profile.statusWrong": "wrong",
    "profile.showAll": "Show all",
    "profile.wrongOnly": "Wrong only",

    "faq.title": "Q/A",
    "faq.subtitle": "About where the questions come from and how to contribute.",
    "faq.source.title": "Where the questions come from",
    "faq.source.crowdly": "Questions are sourced from Crowdly — a community-driven question bank. Some may be inaccurate or wrong.",
    "faq.source.vns": "Material from VNS (the university's remote-learning platform) is also used.",
    "faq.source.disclaimer": "If you spot an error, let me know and I'll fix it.",
    "faq.contribute.title": "Contribute",
    "faq.contribute.body": "The project is open source. To contribute:",
    "faq.contribute.repo": "github.com/ryl1k/oistudy",
    "faq.support.title": "Support & feedback",
    "faq.support.telegram": "Message @ryl1k on Telegram",
    "faq.support.or": "or",
    "faq.support.issues": "open a GitHub issue",

    "picker.title": "Pick a subject",
    "picker.subtitle": "Each subject has its own question bank and topics.",
    "picker.empty": "No subjects yet.",
    "picker.createFirst": "Add the first one →",
    "picker.questions": "questions",
    "picker.heroTagline": "Exam prep in one place. One profile, multiple subjects.",
    "picker.statsQuestions": "Questions",
    "picker.statsTopics": "Topics",
    "picker.statsAccuracy": "Your accuracy",
    "picker.notStarted": "Not started",
    "picker.startCta": "Start",
    "picker.totalSubjects": "{n} subjects",
    "picker.summarySubjects": "subjects",
    "picker.summaryQuestions": "questions total",
    "nav.allSubjects": "All subjects",
    "profile.subjectFilter": "Subject",
    "profile.allSubjects": "All",
    "profile.unknownSubject": "unknown subject",
  },
} as const satisfies Record<Locale, Record<string, string>>;

type Key = keyof (typeof STRINGS)["uk"];

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
  mounted: boolean;
}

const Ctx = createContext<I18nValue | null>(null);

function readSaved(): Locale {
  if (typeof window === "undefined") return "uk";
  const s = window.localStorage.getItem(KEY) as Locale | null;
  return s === "uk" || s === "en" ? s : "uk";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uk");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = readSaved();
    setLocaleState(saved);
    document.documentElement.setAttribute("lang", saved);
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(KEY, l);
    document.documentElement.setAttribute("lang", l);
  };

  const t = (key: Key, vars?: Record<string, string | number>): string => {
    const dict = STRINGS[locale];
    let s: string = dict[key] ?? STRINGS.uk[key] ?? String(key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(v));
      }
    }
    return s;
  };

  return <Ctx.Provider value={{ locale, setLocale, t, mounted }}>{children}</Ctx.Provider>;
}

export function useT(): I18nValue {
  const v = useContext(Ctx);
  if (!v) {
    // Safe fallback for any stray render outside the provider; should not happen
    // in practice now that the layout wraps everything.
    return {
      locale: "uk",
      setLocale: () => {},
      t: (k) => String(k),
      mounted: false,
    };
  }
  return v;
}
