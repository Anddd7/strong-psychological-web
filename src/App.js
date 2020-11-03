import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import FatePlate from "./pages/FatePlate";

const useStyles = makeStyles({
  header: {
    position: "fixed",
    width: "100%",
    top: 0,
  },
  content: {
    marginTop: 65,
    padding: 5,
  },
});

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Header />
      <Container fixed maxWidth="md" className={classes.content}>
        <Switch>
          <Route path="/tools">
            <Tools />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

function Header() {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = useState(history.location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    history.push(newValue);
  };

  return (
    <div className={classes.header}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="主页" value="/" icon={<RestoreIcon />} />
        <BottomNavigationAction
          label="工具"
          value="/tools"
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction
          label="我的"
          value="/home"
          icon={<FavoriteIcon />}
        />
      </BottomNavigation>
    </div>
  );
}

function Tools() {
  return <FatePlate />;
}

function Home() {
  return <p>个人主页, 一些通知/状态/密码设置等</p>;
}

function Dashboard() {
  return <p>整体的菜单入口</p>;
}

export default App;
