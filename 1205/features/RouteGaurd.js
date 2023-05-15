import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { /* useDispatch ,*/ useSelector } from "react-redux";
import { menuCodes } from "../containers/Layout/menu";
// import { logout } from '../features/userSlice'
// import { validateDate } from '@mui/x-date-pickers/internals'
// import axios from 'axios'

export { RouteGuard };

function RouteGuard({ children }) {
  // @ts-ignore
  const menuInReduxStore = useSelector((state) => state.user.menu);

  const user = useSelector((state) => state.user.user);

  // @ts-ignore
  const checkLoginState = useSelector((state) => state.user.isLoggedIn);
  // const dispatch = useDispatch()
  // dispatch(logout)

  // const validate =(token) =>{
  //   const body={
  //     token
  //   }
  //   axios
  //   .post("http://localhost:8090/cfc/auth/validate",body)
  //   .then((r)=>{
  //     if(r.data===true){
  //       router.push("/DepartmentDashboard");
  //     }else{
  //       dispatch(validate);
  //       console.log(checkLoginState);
  //       router.push("/login");
  //     }
  //   })
  // }

  // if(checkLoginState){
  // useEffect(() => {

  //   validate(user?.token);
  // }, [])

  // checkLoginState=false
  // }

  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  // const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    console.log("router guiders", router.asPath);
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);
    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkLoginState]);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    // const publicPaths = ['/login']
    const publicPaths = ["/login", "/Register", "/ForgotPassword"];
    const path = url.split("?")[0];
    // && !publicPaths.includes(path) conditon for routing to previous url hit
    console.log(
      "!checkLoginState && !publicPaths.includes(path)",
      !checkLoginState,
      !publicPaths.includes(path)
    );
    if (!checkLoginState && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
        //query: { returnUrl: router.asPath },
      });
    } else {
      console.log("22");
      setAuthorized(true);
      var code = menuCodes.find((i) =>
        i.path === router.pathname ? i.code : null
      );
      console.log("else 1", code);
      if (code != null) {
        console.log("if");
        if (
          menuInReduxStore?.BackendMenu.indexOf(code) < 0 ||
          menuInReduxStore?.BackendInnerCards.indexOf(code) < 0
        ) {
          router.push("/accessDenied");
          //message.error('Access Denied')
        }
      } else {
        console.log("else");
        // router.push('/')
        // message.error('Access Denied')
      }
    }
  }

  return authorized && children;
}
