import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Services
import { ApiProvider, AuthProvider } from './services';

// Utils
import { RouteCheck } from './utils';

// Routes
import * as Routes from './routes';

// Pages
import { CreateSignpost, Dashboard, EditSignpost, Materials, Modules, Signin, Signposts, Users, Tags, CreateMaterial, EditMaterial, CreateUser, EditUser, CreateModule, EditModule, Whoopsie, CreateTag, EditTag } from './pages';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './_sass/_index.scss';

const App = () => {
  return (
    <AuthProvider>
      <ApiProvider>
        <BrowserRouter>
          <Switch>
            <RouteCheck tokenNeeded={false} path={Routes.WHOOPSIE} component={Whoopsie} />
            <RouteCheck tokenNeeded={true} path={Routes.MATERIALS} component={Materials} />
            <RouteCheck tokenNeeded={true} path={Routes.EDIT_MATERIAL} component={EditMaterial} />
            <RouteCheck tokenNeeded={true} path={Routes.CREATE_MATERIAL} component={CreateMaterial} />
            <RouteCheck tokenNeeded={true} path={Routes.EDIT_MODULE} component={EditModule} />
            <RouteCheck tokenNeeded={true} path={Routes.CREATE_MODULE} component={CreateModule} />
            <RouteCheck tokenNeeded={true} path={Routes.MODULES} component={Modules} />
            <RouteCheck tokenNeeded={true} path={Routes.USERS} component={Users} />
            <RouteCheck tokenNeeded={true} path={Routes.EDIT_USER} component={EditUser} />
            <RouteCheck tokenNeeded={true} path={Routes.CREATE_USER} component={CreateUser} />
            <RouteCheck tokenNeeded={true} path={Routes.EDIT_SIGNPOST} component={EditSignpost} />
            <RouteCheck tokenNeeded={true} path={Routes.CREATE_SIGNPOST} component={CreateSignpost} />
            <RouteCheck tokenNeeded={true} path={Routes.SIGNPOSTS} component={Signposts} />
            <RouteCheck tokenNeeded={true} path={Routes.CREATE_TAG} component={CreateTag} />
            <RouteCheck tokenNeeded={true} path={Routes.EDIT_TAG} component={EditTag} />
            <RouteCheck tokenNeeded={true} path={Routes.TAGS} component={Tags} />
            <RouteCheck tokenNeeded={true} path={Routes.DASHBOARD} component={Dashboard} />
            <RouteCheck tokenNeeded={false} path={Routes.SIGNIN} component={Signin} />
            <RouteCheck tokenNeeded={false} path='/*' component={Whoopsie} />
          </Switch>
        </BrowserRouter>
      </ApiProvider>
    </AuthProvider>
  );
};

export default App;
