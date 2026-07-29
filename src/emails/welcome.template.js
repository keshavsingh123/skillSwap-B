import { baseEmailTemplate } from "./base.template.js";

export function welcomeEmailTemplate({ name }) {
  return baseEmailTemplate({
    title: "Welcome to SkillSwap",

    preheader: "Your SkillSwap account has been created.",

    content: `
      <h2>
        Welcome, ${name}! 👋
      </h2>

      <p>
        Your SkillSwap account has been
        successfully created.
      </p>

      <p>
        You can now discover skills,
        connect with other members,
        teach what you know and learn
        something new.
      </p>

      <p>
        You start your journey as a
        <strong>SkillSwap Member</strong>.
      </p>

      <p>
        Happy learning and sharing!
      </p>

      <p>
        <strong>
          The SkillSwap Team
        </strong>
      </p>
    `,
  });
}
