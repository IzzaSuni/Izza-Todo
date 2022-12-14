import "./App.css";
import Layout from "./components/Layout";
import MainPage from "./components/MainPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";

function App({}) {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/publicNote">
            <Layout>
              <MainPage />
            </Layout>
          </Route>
          <Route path={"/login"}>
            <Layout>
              <Login />
            </Layout>
          </Route>
          <Route path={"/signUp"}>
            <Layout>
              <CreateAccount />
            </Layout>
          </Route>
          <Route exact path={"/publicNote/Private"}>
            <Layout>
              <MainPage />
            </Layout>
          </Route>
          <Route path="*">
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
