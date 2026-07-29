export function baseEmailTemplate({ title, preheader = "", content }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>${title}</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, sans-serif;
          color: #1f2937;
        "
      >

        <div
          style="
            display: none;
            max-height: 0;
            overflow: hidden;
          "
        >
          ${preheader}
        </div>

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            padding: 30px 15px;
            background-color: #f4f6f8;
          "
        >

          <tr>
            <td align="center">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 600px;
                  background: #ffffff;
                  border-radius: 10px;
                  padding: 30px;
                "
              >

                <tr>
                  <td>

                    <h1
                      style="
                        margin-top: 0;
                        font-size: 26px;
                      "
                    >
                      SkillSwap
                    </h1>

                    ${content}

                    <hr
                      style="
                        margin: 30px 0;
                        border: 0;
                        border-top: 1px solid #e5e7eb;
                      "
                    />

                    <p
                      style="
                        font-size: 12px;
                        color: #6b7280;
                      "
                    >
                      This is an automated email from SkillSwap.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>

        </table>

      </body>
    </html>
  `;
}
