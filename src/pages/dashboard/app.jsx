import { Helmet } from 'react-helmet-async';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title>BotFather Dashboard</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
