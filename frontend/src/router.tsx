import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout/>}>
                    <Route path='/auth/login' element={<LoginView></LoginView>}></Route>
                    <Route path='/auth/register' element={<RegisterView></RegisterView>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}