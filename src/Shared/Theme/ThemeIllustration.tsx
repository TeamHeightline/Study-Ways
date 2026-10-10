import React from 'react';
import { observer } from 'mobx-react';
import ThemeStoreObject from '../../global-theme';
import { ThemeStore } from './theme-store';
import reader from './assets/manul/reader.png';
import sleeping from './assets/manul/sleeping.png';
import portrait from './assets/manul/portrait.png';
import explorer from './assets/manul/explorer.png';
import thinker from './assets/manul/thinker.png';
import artist from './assets/manul/artist.png';
import manuscript from './assets/manul/manuscript.png';
import curled from './assets/manul/curled.png';
import snow from './assets/manul/snow.png';
import counting from './assets/manul/counting.png';
import { ManulContext, manulNotes } from './manul-content';

export type Variant =
  | 'reader'
  | 'sleeping'
  | 'portrait'
  | 'explorer'
  | 'thinker'
  | 'artist'
  | 'manuscript'
  | 'curled'
  | 'snow'
  | 'counting';
const packs: Record<string, Record<Variant, string>> = {
  manul: {
    reader,
    sleeping,
    portrait,
    explorer,
    thinker,
    artist,
    manuscript,
    curled,
    snow,
    counting,
  },
};
const getPack = (name: string) =>
  Object.prototype.hasOwnProperty.call(packs, name) ? packs[name] : undefined;

export const ThemeIllustration = observer(
  ({
    variant,
    pack,
    className = '',
    fallback = null,
    store = ThemeStoreObject,
  }: {
    variant: Variant;
    pack?: string;
    className?: string;
    fallback?: React.ReactNode;
    store?: ThemeStore;
  }) => {
    const assets = getPack(pack ?? store.definition.illustrations ?? 'none');
    if (!assets) return <>{fallback}</>;
    return (
      <img
        className={`sw-theme-illustration ${className}`}
        src={assets[variant]}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        loading={variant === 'reader' ? 'eager' : 'lazy'}
        width={variant === 'portrait' ? 64 : 400}
        height={variant === 'portrait' ? 64 : 400}
      />
    );
  },
);

export const ThemeHeroArt = observer(
  ({ store = ThemeStoreObject }: { store?: ThemeStore }) => {
    if (!getPack(store.definition.illustrations ?? 'none')) return null;
    return (
      <div className="sw-themed-hero-art" aria-hidden="true">
        <span className="sw-mascot-halo" />
        <span className="sw-mascot-spark is-first">✦</span>
        <span className="sw-mascot-spark is-second">✧</span>
        <ThemeIllustration variant="reader" store={store} />
        <span className="sw-mascot-caption">Любопытство — в природе.</span>
      </div>
    );
  },
);

export const ThemeCompanion = observer(
  ({
    store = ThemeStoreObject,
    context = 'catalog',
  }: {
    store?: ThemeStore;
    context?: ManulContext;
  }) => {
    if (!getPack(store.definition.illustrations ?? 'none')) return null;
    const note = manulNotes[context];
    return (
      <figure className="sw-theme-companion" aria-hidden="true">
        <ThemeIllustration variant={note.variant} store={store} />
        <figcaption>{note.sidebar}</figcaption>
      </figure>
    );
  },
);
