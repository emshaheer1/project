import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function mailFrom() {
  return process.env.MAIL_FROM?.trim() || "Alpha Polymers <noreply@alphapolymers.local>";
}

async function sendWithResend(input: SendMailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom(),
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend failed (${res.status}): ${body || res.statusText}`);
  }
  return true;
}

async function sendWithSmtp(input: SendMailInput) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return false;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: mailFrom(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
  return true;
}

/** Send email via Resend, SMTP, or console fallback for local/dev. */
export async function sendMail(input: SendMailInput) {
  try {
    if (await sendWithResend(input)) return { channel: "resend" as const };
  } catch (err) {
    console.error("Resend send failed, trying next channel:", err);
  }

  try {
    if (await sendWithSmtp(input)) return { channel: "smtp" as const };
  } catch (err) {
    console.error("SMTP send failed, using console fallback:", err);
  }

  console.info("[mail:console-fallback]", {
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
  return { channel: "console" as const };
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const subject = "Reset your Alpha Polymers password";
  const text = [
    "We received a request to reset your Alpha Polymers account password.",
    "",
    `Open this link to choose a new password (valid for 1 hour):`,
    resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0b1f36">
      <p>We received a request to reset your Alpha Polymers account password.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#1a9bb0;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
          Reset password
        </a>
      </p>
      <p style="font-size:13px;color:#5b6b7c">This link expires in 1 hour. If you did not request a reset, you can ignore this email.</p>
      <p style="font-size:12px;color:#5b6b7c;word-break:break-all">${resetUrl}</p>
    </div>
  `;

  return sendMail({ to, subject, text, html });
}

export async function sendAdminSetPasswordEmail(
  to: string,
  firstName: string,
  temporaryPassword: string,
  loginUrl: string
) {
  const subject = "Your Alpha Polymers account password was updated";
  const text = [
    `Hi ${firstName || "there"},`,
    "",
    "An administrator updated the password for your Alpha Polymers account.",
    "",
    `Temporary password: ${temporaryPassword}`,
    "",
    `Sign in here: ${loginUrl}`,
    "",
    "For your security, sign in and change this password if you prefer a different one.",
    "If you did not expect this email, contact support right away.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0b1f36">
      <p>Hi ${firstName || "there"},</p>
      <p>An administrator updated the password for your Alpha Polymers account.</p>
      <p style="margin:20px 0;padding:14px 16px;background:#f4f7fa;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.04em">
        ${temporaryPassword}
      </p>
      <p>
        <a href="${loginUrl}" style="display:inline-block;padding:12px 18px;background:#1a9bb0;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
          Sign in
        </a>
      </p>
      <p style="font-size:13px;color:#5b6b7c">
        For your security, sign in and change this password if you prefer a different one.
        If you did not expect this email, contact support right away.
      </p>
    </div>
  `;

  return sendMail({ to, subject, text, html });
}

