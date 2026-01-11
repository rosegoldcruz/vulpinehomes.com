// app/privacy/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <Image
            src="/logos/vulpines-official-logo.png"
            alt="Vulpine Homes"
            width={120}
            height={120}
            className="w-24 h-24 object-contain"
          />
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Vulpine Homes ("we," "our," or "us") respects your privacy and is committed to protecting your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Contact Information:</strong> Name, email address, phone number, mailing address</li>
              <li><strong className="text-white">Project Details:</strong> Kitchen measurements, cabinet preferences, countertop selections</li>
              <li><strong className="text-white">Photos:</strong> Images of your current kitchen that you upload for quote purposes</li>
              <li><strong className="text-white">Communication Records:</strong> Messages, emails, and call logs related to your project</li>
              <li><strong className="text-white">Payment Information:</strong> Billing details for contracted services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide quotes and estimates for kitchen remodeling services</li>
              <li>Communicate with you about your project via phone, SMS, email, or Telegram</li>
              <li>Schedule consultations and service appointments</li>
              <li>Process payments and maintain financial records</li>
              <li>Improve our services and customer experience</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Communication Methods</h2>
            <p className="mb-3">
              By submitting a quote request, you consent to receive communications from us via:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">SMS/Text Messages:</strong> Quote updates, appointment reminders, and project notifications</li>
              <li><strong className="text-white">Telegram:</strong> Instant notifications through our Vulpine Homes bot</li>
              <li><strong className="text-white">Email:</strong> Detailed quotes, contracts, and project documentation</li>
              <li><strong className="text-white">Phone Calls:</strong> Consultations and follow-up discussions</li>
            </ul>
            <p className="mt-3">
              You may opt out of marketing communications at any time by contacting us or clicking unsubscribe links in emails.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. How We Share Your Information</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Service Providers:</strong> Third-party vendors who assist with SMS delivery (Twilio), messaging (Telegram), storage (Supabase), and payment processing</li>
              <li><strong className="text-white">Contractors:</strong> Licensed professionals who may work on your project</li>
              <li><strong className="text-white">Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Storage and Security</h2>
            <p>
              We use industry-standard security measures to protect your information, including encrypted storage 
              (Supabase) and secure communication channels. However, no method of transmission over the internet 
              is 100% secure. We cannot guarantee absolute security but take reasonable steps to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Photo Usage</h2>
            <p>
              Photos you submit for quote purposes may be used by Vulpine Homes for marketing and promotional 
              materials, including our website, social media, and advertising. If you do not wish for your photos 
              to be used publicly, please notify us in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking</h2>
            <p>
              Our website may use cookies and similar tracking technologies to improve user experience and analyze 
              website traffic. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Your Rights</h2>
            <p className="mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal obligations)</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect 
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an 
              updated "Last Updated" date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p className="mb-3">
              For questions about this Privacy Policy or to exercise your rights, contact us:
            </p>
            <ul className="space-y-2">
              <li><strong className="text-white">Email:</strong> privacy@vulpinehomes.com</li>
              <li><strong className="text-white">Phone:</strong> +16232670852</li>
              <li><strong className="text-white">Website:</strong> vulpinehomes.com</li>
            </ul>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-red-700 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

