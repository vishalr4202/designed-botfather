import { Helmet } from 'react-helmet-async';

import { KanbanView } from 'src/sections/kanban/view';
import { UserPlaceOrder } from 'src/sections/user-place-order/view';

// ----------------------------------------------------------------------

export default function User() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Place Orders</title>
      </Helmet>

      {/* <KanbanView /> */}
      <UserPlaceOrder />
    </>
  );
}
