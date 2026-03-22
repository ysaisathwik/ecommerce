import { SignIn } from "@clerk/clerk-react";

function Login() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <SignIn afterSignInUrl="/redirect" />
    </div>
  );
}

export default Login;