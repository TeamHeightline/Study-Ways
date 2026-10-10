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
    variants: ['explorer', 'curled', 'explorer'],
    sidebar: 'Большой путь начинается с маленькой лапы.',
    quotes: [
      'Большой путь начинается с маленькой лапы.',
      'Манул не спешит. Манул вникает.',
      'Выйти за пределы привычного можно даже на коротких лапах.',
    ],
  },
  library: {
    label: 'Манул-исследователь',
    variant: 'manuscript',
    variants: ['manuscript', 'reader', 'manuscript'],
    sidebar: 'Древний манускрипт? Сейчас разманулим.',
    quotes: [
      'Древний манускрипт? Сейчас разманулим.',
      'Лупа увеличивает буквы. Любопытство — возможности.',
      'Хорошую мысль манул найдёт даже между строк.',
    ],
  },
  history: {
    label: 'Манулья перекличка',
    variant: 'counting',
    variants: ['counting', 'curled', 'sleeping'],
    sidebar: 'Манул помнит, где было интересно.',
    quotes: [
      'один манул, два манула, три манула, четыре манула и так до 100 манулов ',
      'Манул помнит, где было интересно. Поэтому возвращается.',
      'Если снова открыть хороший материал, он не станет менее хорошим.',
    ],
  },
  bookmarks: {
    label: 'Манульи сокровища',
    variant: 'snow',
    variants: ['snow', 'reader', 'sleeping'],
    sidebar: 'Всё важное — под лапой.',
    quotes: [
      'Всё важное — под лапой. Всё очень важное — в закладках.',
      'Манул не копит лишнее. Только знания. И немного шерсти.',
      'Нашёл полезное — припрятал. Манулья предусмотрительность.',
    ],
  },
  questions: {
    label: 'Манул размышляет',
    variant: 'thinker',
    variants: ['thinker', 'thinker', 'thinker'],
    sidebar: 'Серьёзная мордочка — мыслительный процесс.',
    quotes: [
      'Серьёзная мордочка — это не недовольство. Это мыслительный процесс.',
      'Не знать ответ сразу — нормально. Манул тоже сначала думает.',
      'Сначала подумай. Потом ещё немного подумай. Потом уверенно тыкни лапой.',
    ],
  },
  results: {
    label: 'Манул замечает прогресс',
    variant: 'thinker',
    variants: ['explorer', 'thinker', 'curled'],
    sidebar: 'Даже маленький шаг оставляет след лапы.',
    quotes: [
      'Даже маленький шаг оставляет след лапы.',
      'Ошибка — не повод прятаться в хвост. Это повод попробовать ещё раз.',
      'Сравнивай себя с собой вчерашним. У того манула было меньше опыта.',
    ],
  },
  profile: {
    label: 'Манул знакомится',
    variant: 'portrait',
    variants: ['portrait', 'portrait', 'snow'],
    sidebar: 'Быть собой — вполне манульский план.',
    quotes: [
      'Быть собой — вполне манульский план.',
      'У каждого свой характер. У манула — ещё и роскошные щёки.',
      'Для хорошего знакомства иногда достаточно любопытного взгляда.',
    ],
  },
  editor: {
    label: 'Манул создаёт',
    variant: 'artist',
    variants: ['artist', 'artist', 'thinker'],
    sidebar: 'Сделано с умом. Одобрено лапой.',
    quotes: [
      'Сделано с умом. Одобрено лапой.',
      'Хорошая формулировка стоит ещё одного внимательного взгляда.',
      'Творческий процесс: подумать, поправить, довольно прищуриться.',
    ],
  },
  course: {
    label: 'Манул в пути',
    variant: 'explorer',
    variants: ['explorer', 'manuscript', 'curled'],
    sidebar: 'У каждой ветки знаний есть свой любопытный манул.',
    quotes: [
      'У каждой ветки знаний есть свой любопытный манул.',
      'Можно идти глубже. Можно сделать паузу. Главное — помнить свой путь.',
      'Знания растут деревом. Манул исследует каждую ветку.',
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
