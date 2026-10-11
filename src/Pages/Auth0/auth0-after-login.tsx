import React from 'react';
// AppHook prepares the REST client and user before rendering routes.
export default function Auth0AfterLogin(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return <div {...props} />;
}
