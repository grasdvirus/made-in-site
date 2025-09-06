import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold tracking-tight text-center font-headline sm:text-5xl mb-8">
          Connexion
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
