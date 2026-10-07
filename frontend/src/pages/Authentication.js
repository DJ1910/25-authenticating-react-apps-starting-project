import { redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const data = await request.formData();
  const loginDetails = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") ?? "login";

  if (mode !== "login" && mode !== "signup") {
    throw new Response.json({ message: "Invalid mode" }, { status: 422 });
  }

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginDetails),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    return new Response.json(
      { message: "Could not authenticate user." },
      { status: 500 }
    );
  }

  const { token } = await response.json();

  localStorage.setItem("token", token);
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);
  localStorage.setItem("expiration", expirationDate.toISOString());

  return redirect("/");
}
