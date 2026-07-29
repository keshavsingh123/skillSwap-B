import { baseEmailTemplate } from "./base.template.js";

export function loginAlertEmailTemplate({
  name,
  ipAddress,
  userAgent,
  loginTime,
}) {
  return baseEmailTemplate({
    title: "New login to your SkillSwap account",

    preheader: "A new login was detected on your account.",

    content: `
      <h2>
        Hi ${name},
      </h2>

      <p>
        A new login was detected on your
        SkillSwap account.
      </p>

      <table
        cellpadding="8"
        cellspacing="0"
        style="
          width: 100%;
          background: #f9fafb;
          border-radius: 8px;
        "
      >

        <tr>
          <td>
            <strong>Time</strong>
          </td>

          <td>
            ${loginTime}
          </td>
        </tr>

        <tr>
          <td>
            <strong>IP Address</strong>
          </td>

          <td>
            ${ipAddress || "Unknown"}
          </td>
        </tr>

        <tr>
          <td>
            <strong>Device</strong>
          </td>

          <td>
            ${userAgent || "Unknown"}
          </td>
        </tr>

      </table>

      <p>
        If this was you, no action is required.
      </p>

      <p>
        If you do not recognize this login,
        you should immediately change your
        password and log out from all devices.
      </p>

      <p>
        <strong>
          The SkillSwap Team
        </strong>
      </p>
    `,
  });
}
