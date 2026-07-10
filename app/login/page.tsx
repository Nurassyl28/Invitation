import Link from "next/link";
import { Eye, LogIn, Phone, Shield } from "lucide-react";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "Вход — Toi Invite",
};

export default function LoginPage() {
  return (
    <div>
      <div className="shell">
        <SiteNav section="Вход" />
      </div>
      <main className="auth-shell">
        <section className="auth-card">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span className="brand-mark" style={{ margin: "0 auto 14px" }}>T</span>
            <h1>Welcome back</h1>
            <p className="page-lede">Access your ceremonial dashboard</p>
          </div>

          <form className="compact">
            <label className="field">
              <span>WhatsApp or Email</span>
              <span className="input-with-icon">
                <Phone size={17} />
                <input placeholder="+7 777 000 00 00" />
              </span>
            </label>
            <label className="field">
              <span>Password</span>
              <span className="input-with-icon">
                <Shield size={17} />
                <input placeholder="••••••••" type="password" />
                <Eye size={17} />
              </span>
            </label>
            <div className="button-row" style={{ justifyContent: "space-between", marginTop: 10 }}>
              <label className="switch" style={{ margin: 0 }}>
                <input type="checkbox" />
                Remember me
              </label>
              <Link className="muted" href="/login">Forgot?</Link>
            </div>
            <Link className="button primary" href="/dashboard" style={{ marginTop: 16, width: "100%" }}>
              <LogIn size={16} />
              Log in
            </Link>
          </form>

          <div className="button-row" style={{ justifyContent: "center", marginTop: 28 }}>
            <button className="button secondary" type="button">KZ</button>
            <button className="button secondary" type="button">RU</button>
            <button className="button secondary" type="button">EN</button>
          </div>
        </section>
      </main>
    </div>
  );
}
