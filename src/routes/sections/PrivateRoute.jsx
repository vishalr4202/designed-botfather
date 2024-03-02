// import React from 'react';
// import {  Navigate, Routes,Route } from 'react-router-dom';
// import { getFromLocalStorage } from 'src/utilities/storageUtility';

// const PrivateRoute = ({ component: Component, path, ...rest }) => {
//     const accessToken = getFromLocalStorage('token');
//     const role = getFromLocalStorage('role');

//     return (
//         <Routes>
//         <Route
//             {...rest}
//             // path={path[0]}
//             render={(props) =>
//                 accessToken && accessToken !== '' && role == 'admin'? (
//                         <Component {...props} />
//                     )  : (
//                     <Navigate to="/" />
//                 )
//             }
//         />
//           </Routes>
//     );
// };
// export default PrivateRoute;

import { Navigate, useLocation } from "react-router-dom";
import { getFromLocalStorage } from 'src/utilities/storageUtility';
export default function PrivateRoute({ element }) {
    const accessToken = getFromLocalStorage('token');
    const role = getFromLocalStorage('role');
//   return accessToken && accessToken !== '' && role == 'admin' ? (
//   element
//   ) : (
//     <Navigate to="/dashboard"  replace />
//   );
if ( accessToken == '' || role !== 'admin') {
    return <Navigate to='/dashboard' replace />;
  }

  return element ? element : <Outlet />;
}