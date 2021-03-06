import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

// All pages
import { CreateMaterial, Dashboard, EditMaterial, Landing, Faq, Login, Material, Materials, Module, MyMaterials, MyProfile, MyProfileSettings, Path, Register, SearchResults, SendReset, Signpost, Signposts, SubmitReset, NotFound, Notifications, PrivacyPolicy, Terms } from './pages';

// Main layouts
import { LandingLayout, PageLayout, AuthLayout, SignpostLayout, MaterialLayout, ErrorLayout, StandardLayout } from './layouts';
import { AuthRouteWithLayout, RouteWithLayout, OnlyViewOnDesktop } from './utilities';

// All routes
import * as Routes from './routes';

// All services
import { ApiProvider, AuthProvider, ToolboxProvider } from './services';

import './App.scss';

function App() {
  return (
    <div className="app">
      <ToolboxProvider>
        <AuthProvider>
          <ApiProvider>
            <Router basename='/'>
              <Switch>
                {/** Where the site lands */}
                <RouteWithLayout exact path={Routes.LANDING} component={Landing} layout={LandingLayout} />
                <RouteWithLayout exact path={Routes.PRIVACY_POLICY} component={PrivacyPolicy} layout={StandardLayout} />
                <RouteWithLayout exact path={Routes.TERMS} component={Terms} layout={StandardLayout} />

                {/** Main pages for authentication */}
                <OnlyViewOnDesktop>
                  <RouteWithLayout exact path={Routes.AUTH_SIGN_IN} component={Login} layout={AuthLayout} />
                  <RouteWithLayout exact path={Routes.AUTH_SIGN_UP} component={Register} layout={AuthLayout} />
                  <RouteWithLayout exact path={Routes.AUTH_RESET} component={SendReset} layout={AuthLayout} />
                  <RouteWithLayout exact path={Routes.AUTH_SUBMIT} component={SubmitReset} layout={AuthLayout} />

                  {/** Platform pages */}
                  <AuthRouteWithLayout exact path={Routes.DASHBOARD} component={Dashboard} layout={PageLayout} />
               	  <AuthRouteWithLayout exact path={Routes.FAQ} component={Faq} layout={PageLayout} />
                  <AuthRouteWithLayout exact path={Routes.MY_PROFILE} component={MyProfile} layout={PageLayout} />
                  <AuthRouteWithLayout exact path={Routes.MY_PROFILE_SETTINGS} component={MyProfileSettings} layout={PageLayout} />
                  <AuthRouteWithLayout exact path={Routes.NOTIFICATIONS} component={Notifications} layout={PageLayout} />
          
                  <AuthRouteWithLayout exact path={Routes.SIGNPOSTS} component={Signposts} layout={SignpostLayout} />
                  <AuthRouteWithLayout exact path={Routes.SIGNPOST} component={Signpost} layout={SignpostLayout} />
                  <AuthRouteWithLayout exact path={Routes.MODULE} component={Module} layout={SignpostLayout} />
                  <AuthRouteWithLayout exact path={Routes.PATH} component={Path} layout={SignpostLayout} />

                  <AuthRouteWithLayout exact path={Routes.MATERIALS} component={Materials} layout={MaterialLayout} />
                  <AuthRouteWithLayout exact path={Routes.MATERIAL} component={Material} layout={MaterialLayout} />
                  <AuthRouteWithLayout exact path={Routes.MY_MATERIALS} component={MyMaterials} layout={MaterialLayout} />
                  <AuthRouteWithLayout exact path={Routes.EDIT_MATERIAL} component={EditMaterial} layout={MaterialLayout} />
                  <AuthRouteWithLayout exact path={Routes.ADD_MATERIAL} component={CreateMaterial} layout={MaterialLayout} />
                  <AuthRouteWithLayout exact path={Routes.SEARCH_RESULTS} component={SearchResults} layout={MaterialLayout} />
                </OnlyViewOnDesktop>

				<RouteWithLayout path={Routes.NOT_FOUND} component={NotFound} layout={ErrorLayout} />

              </Switch>

            </Router>
          </ApiProvider>
        </AuthProvider>
      </ToolboxProvider>
    </div>
  );
};

export default App;
