import React from "react";
import { Auth, Hub } from "aws-amplify"; // "Hub" allows us to Dispatch & Listen to events
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MarketPage from "./pages/MarketPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import "./App.css";

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    // console.dir(AmplifyTheme); // this line of code will console log all the diff components/elements we can modify
    this.getUserData();
    Hub.listen("auth", this, "onHubCapsule");
  }

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }) : this.setState({ user: null });
  };

  onHubCapsule = capsule => {
    switch(capsule.payload.event) {
      case "signIn":
        console.log("signed in");
        this.getUserData();
        break;
      case "signUp":
        console.log("signed up");
        break;
      case "signOut":
        console.log("signed out");
        this.setState({ user: null });
        break;
      default:
        return;
    }
  };

  handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch(err) {
      console.error("Error signing out user", err);
    }
  };

  render() {
    const { user } = this.state;
    return !user ? (
      <Authenticator theme={theme} />
    ) : (
      <Router>
        <React.Fragment>
          {/* Navigation */}
          <Navbar user={user} handleSignOut={this.handleSignOut} />

          {/* Routes */}
          <div className="app-container">
            <Route exact path="/" component={HomePage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/markets/:marketId" component={
              ({ match }) => <MarketPage marketId={match.params.marketId} />
            } />
          </div>
        </React.Fragment>
      </Router>
    );
  }
}


const theme = {
  ...AmplifyTheme, // using the spread operator (...) gives us all the default values
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: "#ffc0cb"
  },
  button: {
    ...AmplifyTheme.button,
    backgroundColor: "var(--amazonOrange)" // this is how we specify specific CSS variables used in the withAuthenticator() modal
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: "5px"
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: "var(--squidInk)"
  }
};

// export default withAuthenticator(App, true, [], null, theme);
export default App;