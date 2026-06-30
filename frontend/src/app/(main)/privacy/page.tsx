export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: June 29, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            When you register or make a purchase, we collect information such as your name, email address, shipping address, and payment details. We also collect usage data (pages visited, products viewed) to improve your experience.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfill your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To improve our platform and personalize your experience</li>
            <li>To send promotional emails (only with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Cookies</h2>
          <p>
            FunShop uses cookies to keep you signed in and remember your cart. We also use analytics cookies to understand how visitors use our site. You can disable cookies in your browser settings, though some features may not work correctly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Sharing of Information</h2>
          <p>
            We do not sell your personal data. We share information only with trusted third parties necessary to operate our service (e.g., payment processors, shipping carriers). These partners are contractually required to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
          <p>
            We use industry-standard encryption (TLS/HTTPS) and httpOnly cookies to protect your data in transit and at rest. Access to personal data is restricted to authorized personnel only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active. You can request deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Your Rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your personal data. To exercise these rights, email us at <span className="text-[#2563EB]">privacy@funshop.com</span>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Children's Privacy</h2>
          <p>
            FunShop is not intended for children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us data, please contact us and we will promptly delete it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Significant changes will be communicated via email to registered users. Continued use of FunShop after changes means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">10. Contact</h2>
          <p>
            For privacy questions or requests: <span className="text-[#2563EB]">privacy@funshop.com</span>
          </p>
        </section>

      </div>
    </div>
  )
}
