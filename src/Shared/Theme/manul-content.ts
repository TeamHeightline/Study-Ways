import type { Variant } from './ThemeIllustration';

const defineNotes = <
  T extends Record<
    string,
    {
      label: string;
      variant: Variant;
      variants: readonly Variant[];
      sidebar: string;
      quotes: readonly string[];
    }
  >,
>(
  notes: T,
) => notes;

export const manulNotes = defineNotes({
  catalog: {
    label: 'Манулья мудрость',
    variant: 'explorer',
    variants: ['explorer', 'curled', 'explorer', 'astronomer', 'tea'],
    sidebar: 'Большой путь начинается с маленькой лапы.',
    quotes: [
      'Большой путь начинается с маленькой лапы.',
      'Манул не спешит. Манул вникает.',
      'Выйти за пределы привычного можно даже на коротких лапах.',
      'От механики к квантам — по одной любопытной лапе.',
      'Манул сделал чай. Теперь можно разбираться с теплопередачей.',
    ],
  },
  library: {
    label: 'Манул-исследователь',
    variant: 'manuscript',
    variants: [
      'manuscript',
      'reader',
      'manuscript',
      'prism',
      'pendulum',
      'weightless',
      'thinker',
      'snow',
      'curled',
      'astronomer',
      'doppler',
      'rotation',
    ],
    sidebar: 'Древний манускрипт? Сейчас разманулим.',
    quotes: [
      'Древний манускрипт? Сейчас разманулим.',
      'Лупа увеличивает буквы. Любопытство — возможности.',
      'Хорошую мысль манул найдёт даже между строк.',
      'Белый свет оказался разноцветным. Манул подозревал, что тут не всё так просто.',
      'Манул изучает колебания: между «понял» и «посмотрю ещё раз».',
      'Невесомость: лапы отдыхают, любопытство продолжает работать.',
      'Преобразования Лоренца? Манул просит не торопиться со временем.',
      'Сила трения помогает манулу не съезжать с пенька.',
      'Манул и инерция: попробуй уговори его встать.',
      'Момент импульса сохраняем. Серьёзную мордочку — тоже.',
      'Поезд ещё далеко, а манул уже изучает эффект Доплера.',
      'Центростремительное ускорение — к центру. Любопытство манула — во все стороны.',
    ],
  },
  history: {
    label: 'Манулья перекличка',
    variant: 'counting',
    variants: ['counting', 'curled', 'sleeping', 'counting', 'tea'],
    sidebar: 'Манул помнит, где было интересно.',
    quotes: [
      'один манул, два манула, три манула, четыре манула и так до 100 манулов ',
      'Манул помнит, где было интересно. Поэтому возвращается.',
      'Если снова открыть хороший материал, он не станет менее хорошим.',
      '1 манул, 2 манула, 3 манула… Пересчитал манулов — можно пересмотреть лекцию.',
      'Вернуться к сложной теме — тоже движение вперёд. Даже если манул пока лежит.',
    ],
  },
  bookmarks: {
    label: 'Манульи сокровища',
    variant: 'snow',
    variants: ['snow', 'reader', 'sleeping', 'tea', 'curled'],
    sidebar: 'Всё важное — под лапой.',
    quotes: [
      'Всё важное — под лапой. Всё очень важное — в закладках.',
      'Манул не копит лишнее. Только знания. И немного шерсти.',
      'Нашёл полезное — припрятал. Манулья предусмотрительность.',
      'Закон сохранения полезных лекций: сначала добавь в закладки.',
      'Манул свернулся клубком. Любимая лекция дождётся.',
    ],
  },
  questions: {
    label: 'Манул размышляет',
    variant: 'thinker',
    variants: [
      'thinker',
      'thinker',
      'thinker',
      'pendulum',
      'astronomer',
      'thinker',
    ],
    sidebar: 'Серьёзная мордочка — мыслительный процесс.',
    quotes: [
      'Серьёзная мордочка — это не недовольство. Это мыслительный процесс.',
      'Не знать ответ сразу — нормально. Манул тоже сначала думает.',
      'Сначала подумай. Потом ещё немного подумай. Потом уверенно тыкни лапой.',
      'Если задача о силах, манул сначала рисует силы. Даже когда очень хочется сразу ответ.',
      'В условии идеальный маятник. В решении — очень старательный манул.',
      'Манул сменил систему отсчёта. Миска осталась главным ориентиром.',
    ],
  },
  results: {
    label: 'Манул замечает прогресс',
    variant: 'thinker',
    variants: ['explorer', 'thinker', 'curled', 'weightless', 'tea'],
    sidebar: 'Даже маленький шаг оставляет след лапы.',
    quotes: [
      'Даже маленький шаг оставляет след лапы.',
      'Ошибка — не повод прятаться в хвост. Это повод попробовать ещё раз.',
      'Сравнивай себя с собой вчерашним. У того манула было меньше опыта.',
      'Каждая решённая задача добавляет импульс. Манул одобряет направление.',
      'Разобрался с трудной темой? Можно выдохнуть, налить чай и довольно прищуриться.',
    ],
  },
  profile: {
    label: 'Манул знакомится',
    variant: 'portrait',
    variants: ['portrait', 'portrait', 'snow', 'tea', 'curled'],
    sidebar: 'Быть собой — вполне манульский план.',
    quotes: [
      'Быть собой — вполне манульский план.',
      'У каждого свой характер. У манула — ещё и роскошные щёки.',
      'Для хорошего знакомства иногда достаточно любопытного взгляда.',
      'Специальность: любопытный манул. Дополнительный навык: уютные перерывы.',
      'Масса шерсти велика. Тяга к знаниям — ещё больше.',
    ],
  },
  editor: {
    label: 'Манул создаёт',
    variant: 'artist',
    variants: ['artist', 'artist', 'thinker', 'tea', 'prism'],
    sidebar: 'Сделано с умом. Одобрено лапой.',
    quotes: [
      'Сделано с умом. Одобрено лапой.',
      'Хорошая формулировка стоит ещё одного внимательного взгляда.',
      'Творческий процесс: подумать, поправить, довольно прищуриться.',
      'Перед новой лекцией — чай. Перед публикацией — ещё один внимательный взгляд.',
      'Пусть объяснение будет ясным, как свет после хорошего опыта. Манул уже приготовил призму.',
    ],
  },
  course: {
    label: 'Манул в пути',
    variant: 'explorer',
    variants: [
      'explorer',
      'manuscript',
      'curled',
      'prism',
      'astronomer',
      'rotation',
    ],
    sidebar: 'У каждой ветки знаний есть свой любопытный манул.',
    quotes: [
      'У каждой ветки знаний есть свой любопытный манул.',
      'Можно идти глубже. Можно сделать паузу. Главное — помнить свой путь.',
      'Знания растут деревом. Манул исследует каждую ветку.',
      'Сегодня механика, завтра оптика. Манул готов расширять кругозор.',
      'От траектории снаряда до орбиты планеты — любопытству манула тесно на одном пеньке.',
      'Скорость меняется? Манул проверяет ускорение. А заодно — куда катится его платформа.',
    ],
  },
});

export type ManulContext = keyof typeof manulNotes;

export function getManulContext(pathname: string): ManulContext {
  const section = pathname.split('/').filter(Boolean)[0];
  const sections: Record<string, ManulContext> = {
    cards: 'library',
    card: 'library',
    'recent-cards': 'history',
    bookmarks: 'bookmarks',
    'all-questions': 'questions',
    iq: 'questions',
    selfstatistic: 'results',
    statistic: 'results',
    profile: 'profile',
    editor: 'editor',
    course: 'course',
    'ai-course': 'course',
  };
  return Object.prototype.hasOwnProperty.call(sections, section)
    ? sections[section]
    : 'catalog';
}

// Visible names belong to the illustration pack; routes and standard names stay stable.
export const manulNavigation: Record<string, string> = {
  '/courses': 'Тропы познания',
  '/ai-course': 'Манул-навигатор',
  '/cards': 'Кладовая знаний',
  '/all-questions': 'Задачки на лапку',
  '/recent-cards': 'Следы лап',
  '/bookmarks': 'Под лапой',
  '/selfstatistic': 'Успехи манула',
  '/editor': 'Мастерская манула',
};

export function getThemedNavigationLabel(
  path: string,
  original: string,
  illustrationPack?: string,
): string {
  return illustrationPack === 'manul' &&
    Object.prototype.hasOwnProperty.call(manulNavigation, path)
    ? manulNavigation[path]
    : original;
}
