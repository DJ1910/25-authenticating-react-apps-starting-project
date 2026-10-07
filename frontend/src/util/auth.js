import { redirect } from "react-router-dom";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function getToken() {
  if (!localStorage.getItem("token")) {
    return null;
  }

  const duration = getTokenDuration();

  if (duration <= 0) {
    return "EXPIRED";
  }

  return localStorage.getItem("token");
}

export function checkAuthLoader() {
  const token = getToken();

  if (!token) {
    return redirect("/auth");
  }

  return null;
}

export function checkLoginLoader() {
  const token = getToken();

  if (token) {
    return redirect("/");
  }

  return null;
}
