import { Outlet } from "react-router-dom";
import { Toolbar } from "@mui/material";
import RequireAuth from "../../components/RequireAuth";
import AppBarHeader from "../AppBarHeader";
import Footer from "../../components/Footer";

export default function MemberLayout() {



  return (
    <RequireAuth role={"ROLE_MEMBER"}>
      <AppBarHeader/>
      <Toolbar />
      <Outlet />
      <Footer></Footer>

    </RequireAuth>
  );
}
