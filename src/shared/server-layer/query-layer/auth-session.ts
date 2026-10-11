let version = 0;
let active = false;
export const getAuthSessionVersion = () => version;
export const isAuthSessionActive = () => active;
export function activateAuthSession() {
  active = true;
}
export function invalidateAuthSession() {
  version++;
  active = false;
}
