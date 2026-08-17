"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SuccessModal } from "@/components/SuccessModal";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "register";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  const initialMode: Mode =
    searchParams.get("tab") === "register" ? "register" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setMode(searchParams.get("tab") === "register" ? "register" : "login");
    setError("");
  }, [searchParams]);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    router.replace(next === "register" ? "/login?tab=register" : "/login", {
      scroll: false,
    });
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(loginForm.email, loginForm.password);
      setLoginSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(registerForm);
      setRegisterForm({ firstName: "", lastName: "", email: "", password: "" });
      setRegisterSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function closeLoginSuccess() {
    setLoginSuccess(false);
    router.push("/");
  }

  function closeRegisterSuccess() {
    setRegisterSuccess(false);
    switchMode("login");
  }

  return (
    <div className="pb-20">
      <SuccessModal
        open={loginSuccess}
        title="Login Successfully"
        message="Welcome back. You are now signed in to your Alpha Peptides account."
        onClose={closeLoginSuccess}
      />
      <SuccessModal
        open={registerSuccess}
        title="Registered Successfully"
        message="Your account has been created. Please log in to continue."
        onClose={closeRegisterSuccess}
      />

      <PageHero
        eyebrow="Account Access"
        title="Login or Create Account"
        description="Sign in to manage orders and wishlist items, or create a new research account to get started."
      />

      <div className="container-site mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)]">
            <p className="eyebrow">Member benefits</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
              Your research account
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Track orders, save products, and check out faster with a secure
              Alpha Peptides account.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-[var(--muted)]">
              {[
                "View full order history",
                "Faster checkout with saved details",
                "Wishlist sync across sessions",
                "Priority support for account holders",
              ].map((item, i) => (
                <li key={item} className="flex gap-3">
                  <span className="font-semibold tabular-nums text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="border-l-2 border-[var(--accent)]/30 pl-3">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3">
              <Link href="/shop" className="btn btn-outline w-full">
                Browse products
              </Link>
              <Link href="/faqs" className="btn btn-outline w-full">
                Read FAQs
              </Link>
            </div>
            <div className="mt-7 rounded-[var(--radius)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              Research use only · Not for human consumption
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              {mode === "login" ? "Sign In" : "New Account"}
            </h2>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
            <div className="grid grid-cols-2 border-b border-[var(--line)]">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`px-4 py-4 text-sm font-semibold tracking-wide transition ${
                  mode === "login"
                    ? "bg-[var(--navy)] text-white"
                    : "bg-white text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--navy)]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`px-4 py-4 text-sm font-semibold tracking-wide transition ${
                  mode === "register"
                    ? "bg-[var(--navy)] text-white"
                    : "bg-white text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--navy)]"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="p-7 md:p-8">
              {mode === "login" ? (
                <form onSubmit={onLogin} className="space-y-4">
                  <p className="text-sm text-[var(--muted)]">
                    Welcome back. Enter your credentials to access your account.
                  </p>
                  <div>
                    <label className="label">Email</label>
                    <input
                      className="field"
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <input
                      className="field"
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((p) => ({ ...p, password: e.target.value }))
                      }
                    />
                  </div>
                  {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
                  <button className="btn btn-dark btn-lg w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                  <p className="text-center text-sm text-[var(--muted)]">
                    New researcher?{" "}
                    <button
                      type="button"
                      className="font-semibold text-[var(--accent)] hover:underline"
                      onClick={() => switchMode("register")}
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={onRegister} className="space-y-4">
                  <p className="text-sm text-[var(--muted)]">
                    Create an account to place orders and manage your research purchases.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">First name</label>
                      <input
                        className="field"
                        required
                        value={registerForm.firstName}
                        onChange={(e) =>
                          setRegisterForm((p) => ({
                            ...p,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Last name</label>
                      <input
                        className="field"
                        required
                        value={registerForm.lastName}
                        onChange={(e) =>
                          setRegisterForm((p) => ({
                            ...p,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      className="field"
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <input
                      className="field"
                      type="password"
                      minLength={8}
                      required
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                    />
                    <p className="mt-1.5 text-xs text-[var(--muted)]">
                      At least 8 characters, with letters and numbers.
                    </p>
                  </div>
                  {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
                  <button className="btn btn-dark btn-lg w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create account"}
                  </button>
                  <p className="text-center text-sm text-[var(--muted)]">
                    Already registered?{" "}
                    <button
                      type="button"
                      className="font-semibold text-[var(--accent)] hover:underline"
                      onClick={() => switchMode("login")}
                    >
                      Login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-16 text-[var(--muted)]">Loading account...</div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
