let siteKey = '6Ld1x2YqAAAAAB5wyC9mxdVGJZazwmTkvrSx0JrN'
export async function getCaptchaToken() {
  await new Promise(resolve => {
    grecaptcha.ready(resolve);
  });

  try {
    const token = await grecaptcha.execute(siteKey, { action: 'submit' });
    return token;
  } catch (error) {
    console.error('reCAPTCHA execution failed:', error);
    alert('reCAPTCHA verification failed. Please try again.');
    // Throw so the caller knows it failed and stops any further logic
    throw error;
  }
}