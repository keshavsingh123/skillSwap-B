export async function sendEmailSafe(emailPromise) {
  try {
    await emailPromise;
  } catch (error) {
    console.error("Email delivery failed:", error.message);
  }
}
