import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from './composants/Spinner';

const Produits = lazy(() => import('./produits/Dashboard'));

const Categories = lazy(() => import('./categories/BasicElements'));


class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path="/dashboard" component={ Produits } />

          <Route path="/form-Elements/basic-elements" component={ Categories } />

          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;