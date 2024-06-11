import { Route,Routes } from "react-router-dom";

import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/Login/LoginPage";
import HomePage from "./pages/auth/Home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/auth/Notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { Navigate } from "react-router-dom";
function App() {
  const{data:authUser,isLoading,error,isError} = useQuery({
    queryKey: ['authUser'],
    queryFn: async() =>{
      try{
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      }
      catch(error){
      throw new Error(error);
      }
    },
    retry:false,
  });
  if(isLoading){
    return(
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg"></LoadingSpinner>
      </div>
    )
  }
 
  return (
    <div className='flex max-w-6xl mx-auto'>
    {authUser && <Sidebar/>}
    <Routes>
      <Route path="/" element={authUser ? <HomePage/> : <Navigate to = "/login" />} /> 
      <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to = "/" />}></Route>
      <Route path="/signUp" element={!authUser ? <SignUpPage/> : <Navigate to="/" />}></Route>
      <Route path="/notifications" element={authUser ? <NotificationPage/> : <Navigate to = "/login" />}></Route>
      <Route path="/profile/:username" element={authUser ? <ProfilePage/> : <Navigate to = "/login" />}></Route>
    </Routes>
    {authUser && <RightPanel/>}
    <Toaster/>
    </div>
  );
}

export default App;
