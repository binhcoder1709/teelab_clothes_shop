import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function useCookie(cookieName) {
  const [cookieValue, setCookieValue] = useState(null);

  useEffect(() => {
    const fetchCookie = () => {
      const cookie = Cookies.get(cookieName);
      const decoded = cookie ? jwtDecode(cookie) : null;
      setCookieValue(decoded);
    };

    fetchCookie();
  }, [cookieName]);

  return cookieValue;
}
