// app/terms/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
            Terms of Service
          </h1>
          <p className="text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using Vulpine Homes' services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Services Provided</h2>
            <p className="mb-3">
              Vulpine Homes provides kitchen cabinet refacing and remodeling services in Arizona, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cabinet refacing and refinishing</li>
              <li>Custom cabinet installation</li>
              <li>Countertop installation</li>
              <li>Kitchen design consultation</li>
              <li>Free quotes and estimates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Quote Requests</h2>
            <p className="mb-3">
              When you submit a quote request through our website:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You authorize us to contact you via phone, SMS, or email</li>
              <li>Quotes are estimates and may change based on final measurements and material selection</li>
              <li>Quotes are valid for 30 days from the date of issue</li>
              <li>Photos submitted become property of Vulpine Homes for marketing purposes unless otherwise requested</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
            <p className="mb-3">
              For contracted services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>A deposit may be required to begin work</li>
              <li>Payment schedules will be outlined in your service contract</li>
              <li>Final payment is due upon project completion</li>
              <li>We accept cash, check, and major credit cards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cancellation Policy</h2>
            <p>
              Cancellations must be made in writing. Deposits may be non-refundable if materials have been ordered 
              or work has commenced. Specific cancellation terms will be outlined in your service contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Warranty</h2>
            <p>
              Vulpine Homes stands behind our work. Warranty terms vary by service and will be detailed in your 
              service contract. Warranties do not cover damage caused by misuse, accidents, or normal wear and tear.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
            <p>
              Vulpine Homes shall not be liable for any indirect, incidental, special, or consequential damages 
              arising from the use of our services. Our total liability shall not exceed the amount paid for services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the property of 
              Vulpine Homes and protected by copyright laws. Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of the State of Arizona. Any disputes shall be 
              resolved in the courts of Arizona.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
            <p>
              Vulpine Homes reserves the right to modify these terms at any time. Continued use of our services 
              after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
            <p className="mb-3">
              For questions about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2">
              <li><strong className="text-white">Email:</strong> info@vulpinehomes.com</li>
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

