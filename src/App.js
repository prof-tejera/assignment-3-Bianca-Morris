import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";

import DocumentationView from "./views/DocumentationView";
import TimersView from "./views/TimersView";
import AddView from "./views/AddView";

import AppProvider from "./context/AppProvider";
// import { H1 } from "./utils/tokensAndTheme";

const Container = styled.div`
  background: #f0f6fb;
  height: 100vh;
  overflow: auto;
`;

const Nav = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  background-color: #333333;
  display: flex;
  justify-content: space-between;
`;

const NavItem = styled.li`
  display: inline-block;
  padding: 10px;
  text-decoration: none;
  
  >a {
    color: #ffffff;
    :hover {
      color: #dedede;
    }
  }
`;

const ViewCenterer = styled.div`
  display: flex;
  height: calc(100% - 40px);
  justify-content: center;
`;

function App() {
  return (
    <Container>
      <Router>
        <nav>
          <Nav>
            <NavItem>
              <Link to="/">Timers</Link>
            </NavItem>
            <NavItem>
              <Link to="/docs">Documentation</Link>
            </NavItem>
          </Nav>
        </nav>
        <ViewCenterer>
          <Switch>
            <Route path="/docs">
              <DocumentationView />
            </Route>
            <Route path="/add">
              <AppProvider>
                <AddView />
              </AppProvider>
            </Route>
            <Route path="/">
              <AppProvider>
                <TimersView />
              </AppProvider>
            </Route>
          </Switch>
        </ViewCenterer>
      </Router>
    </Container>
  );
}

export default App;
