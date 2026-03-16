import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer';
import AppBarHeader from '../AppBarHeader';
import RequireAuth from "../../components/RequireAuth";


export default function DefaultLayout() {





    return (
        <>
            <AppBarHeader />
            <Outlet />
            <Footer></Footer>
        </>
    );
}