import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { logout } from "../api/authService";

function AppBarHeader() {
  const { user, loadUser } = useAuth();

  //'Home', 'News', 'q-a', 'Contact'
  const pages = [
    {
      title: "Trang Chủ",
      path: "/home",
    },
    {
      title: "Tin Tức",
      path: "/news",
    },
    {
      title: "Hỏi - Đáp",
      path: "/q-a",
    },
    {
      title: "Liên Hệ",
      path: "/contact",
    },
  ];
  // Register User
  const manage = [
    { title: "Lịch Hẹn Đã Đặt", path: "/user/appointment-histories" },
  ];
  //'Profile', 'Account', 'Logout'
  const settings = [
    { title: "Hồ Sơ", path: "/user/profile" },
    { title: "Chứng nhận", path: "/user/certificate" },

    { title: "Lịch Sử Hiến Máu", path: "/user/donation-histories" },
  ];
  // Get User Infor fake API. If have real API will decode TOkEN to GET Name and Role to Auth.
  //  if get Token is null will dont display permission of member like avata name

  // handle Link
  useEffect(() => {
    loadUser();
  }, []);

  const navigate = useNavigate();

  const handleClickSignin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    logout();
    await loadUser();
    navigate("/");
  };

  //  handle UI
  const location = useLocation();
  const allItems = [...pages, ...(user ? manage : [])];
  const selectedItemCurrent =
    allItems.find((item) => location.pathname.startsWith(item.path))?.title ??
    "Trang Chủ";
  const [selectedItem, setSelectedItem] = useState(selectedItemCurrent);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const avatarUrl = user?.avatarUrl
    ? `${import.meta.env.VITE_AVATAR_BASE_URL}/images/uploads/${user.avatarUrl}`
    : undefined;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const words = fullName.split(" ");
    return words.length >= 2
      ? words[0][0] + words[words.length - 1][0]
      : fullName[0];
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: "white" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* logo */}
          <Box
            component={Link}
            to="/home"
            sx={{
              margin: "10px 50px 10px 10px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mr: 4,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <img src="/logo/logo.png" alt="Logo" style={{ height: 60 }} />
            <Typography color="error" variant="h6">
              Trung Tâm Hiến Máu
            </Typography>
          </Box>
          {/* display menu icon and menu small screen*/}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            {/* menu  */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map(({ title, path }) => (
                <MenuItem key={title} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    to={path}
                    component={Link}
                  >
                    {title}
                  </Typography>
                </MenuItem>
              ))}
              {user &&
                manage.map(({ title, path }) => (
                  <MenuItem key={title} onClick={handleCloseNavMenu}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "black",
                        textTransform: "none",
                      }}
                      to={path}
                      component={Link}
                    >
                      {title}
                    </Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          {/* display menu with large screen */}

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "left",
            }}
          >
            {pages.map(({ title, path }) => (
              <Button
                key={title}
                selected={selectedItem === title}
                onClick={() => {
                  setSelectedItem(title);
                  navigate(path);
                }}
                sx={{
                  my: 2,
                  mx: 1,
                  display: "block",
                  textAlign: "center",
                  color: selectedItem === title ? "black" : "black",
                  borderBottom: "5px solid",
                  borderColor: selectedItem === title ? "red" : "transparent",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                }}
                component={Link}
                to={path}
              >
                <Typography variant="h6" sx={{ textTransform: "none" }}>
                  {title}
                </Typography>
              </Button>
            ))}
            {user &&
              manage.map(({ title, path }) => (
                <Button
                  key={title}
                  selected={selectedItem}
                  onClick={() => {
                    setSelectedItem(title);
                    navigate(path);
                  }}
                  sx={{
                    my: 2,
                    mx: 1,
                    display: "block",
                    textAlign: "center",
                    color: selectedItem === title ? "black" : "black",
                    borderBottom: "5px solid",
                    borderColor: selectedItem === title ? "red" : "transparent",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                  component={Link}
                  to={path}
                >
                  <Typography variant="h6" sx={{ textTransform: "none" }}>
                    {title}
                  </Typography>
                </Button>
              ))}
          </Box>
          {/* display when login success */}

          {user && (
            <Box sx={{ flexGrow: 0 }}>
              {/* display avatar */}
              <Tooltip title="Open settings">
                <Button
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Avatar
                    src={avatarUrl}
                    sx={{
                      bgcolor: !user.avatarUrl ? "primary.main" : "transparent",
                      width: 50,
                      height: 50,
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {!user.avatarUrl && getInitials(user.fullName)}
                  </Avatar>
                  <Typography color="black">{user.fullName}</Typography>
                </Button>
              </Tooltip>
              {/* display settings */}
              <Menu
                sx={{ mt: "50px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map(({ title, path }) => (
                  <MenuItem
                    key={title}
                    component={Link}
                    to={`${path}`}
                    onClick={handleCloseUserMenu}
                    sx={{ textTransform: "none" }}
                  >
                    {title}
                  </MenuItem>
                ))}
                <MenuItem
                  key={"logout"}
                  onClick={() => {
                    handleCloseUserMenu();
                    handleLogout();
                  }}
                >
                  <Typography
                    sx={{ textAlign: "center", textTransform: "none" }}
                  >
                    Đăng Xuất
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* display box login or signup */}
          {!user && (
            <Button
              color="error"
              variant="contained"
              onClick={handleClickSignin}
            >
              <Typography
                variant="h6"
                sx={{ color: "error", textTransform: "none" }}
              >
                Đăng nhập
              </Typography>
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppBarHeader;
