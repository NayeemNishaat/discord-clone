import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginInfo } from "../../redux/slices/authSlice";

function Layout(props: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/auth/check-login`,
          {
            method: "POST",
            credentials: "include"
          }
        );

        const data = await res.json();
        if (data.status !== "success") {
          localStorage.removeItem("loginInfo");
          dispatch(setLoginInfo({ _id: null, email: null, username: null }));
          return;
        }

        const storedLoginInfo: {
          _id: string;
          email: string;
          username: string;
        } = JSON.parse(localStorage.getItem("loginInfo") || "null");

        if (!storedLoginInfo) return;
        dispatch(setLoginInfo(storedLoginInfo));
      } catch (err) {}
    })();
  }, []);

  return <>{props.children}</>;
}

export default Layout;
