import React from 'react';
import { useThemeSettings } from '../../global-theme';
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
import astronomer from './assets/manul/astronomer.png';
import tea from './assets/manul/tea.png';
import prism from './assets/manul/prism.png';
import pendulum from './assets/manul/pendulum.png';
import weightless from './assets/manul/weightless.png';
import doppler from './assets/manul/doppler.png';
import rotation from './assets/manul/rotation.png';
import charges from './assets/manul/charges.png';
import magnet from './assets/manul/magnet.png';
import waves from './assets/manul/waves.png';
import vacuum from './assets/manul/vacuum.png';
import resonance from './assets/manul/resonance.png';
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
  | 'counting'
  | 'astronomer'
  | 'tea'
  | 'prism'
  | 'pendulum'
  | 'weightless'
  | 'doppler'
  | 'rotation'
  | 'charges'
  | 'magnet'
  | 'waves'
  | 'vacuum'
  | 'resonance';
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
    astronomer,
    tea,
    prism,
    pendulum,
    weightless,
    doppler,
    rotation,
    charges,
    magnet,
    waves,
    vacuum,
    resonance,
  },
};
const getPack = (name: string) =>
  Object.prototype.hasOwnProperty.call(packs, name) ? packs[name] : undefined;
export const ThemeIllustration = ({
  variant,
  pack,
  className = '',
  fallback = null,
}: {
  variant: Variant;
  pack?: string;
  className?: string;
  fallback?: React.ReactNode;
}) => {
  const store = useThemeSettings();
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
};
export const ThemeHeroArt = () => {
  const store = useThemeSettings();
  if (!getPack(store.definition.illustrations ?? 'none')) return null;
  return (
    <div className="sw-themed-hero-art" aria-hidden="true">
      <span className="sw-mascot-halo" />
      <span className="sw-mascot-spark is-first">✦</span>
      <span className="sw-mascot-spark is-second">✧</span>
      <ThemeIllustration variant="reader" />
      <span className="sw-mascot-caption">Любопытство — в природе.</span>
    </div>
  );
};
export const ThemeCompanion = ({
  context = 'catalog',
}: {
  context?: ManulContext;
}) => {
  const store = useThemeSettings();
  if (!getPack(store.definition.illustrations ?? 'none')) return null;
  const note = manulNotes[context];
  return (
    <figure className="sw-theme-companion" aria-hidden="true">
      <ThemeIllustration variant={note.variant} />
      <figcaption>{note.sidebar}</figcaption>
    </figure>
  );
};
