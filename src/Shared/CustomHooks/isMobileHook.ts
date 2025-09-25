import { useMediaQuery } from "react-responsive";

export function isMobileHook() {
  return useMediaQuery({ maxWidth: 767 });
}
