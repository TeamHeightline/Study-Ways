import React from 'react';
export function RouterWrapper({ children }: { children: React.ReactNode }) {
  return <main className="sw-main" id="main-content">{children}</main>;
}
