"use client"

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-600">
          &larr; Back to home page
        </Link>
      </div>
      
      <div className="bg-game-gray rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Terms and Conditions</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the GameRipple website ("Service"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Use of Service</h2>
          <p className="mb-4">
            GameRipple provides information about video games, including reviews, news, and links to other websites. Our Service is intended for informational purposes only.
          </p>
          <p className="mb-4">
            We do not encourage or promote piracy or copyright infringement. All external links provided are for reference purposes, and we are not responsible for the content of such external sites.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Intellectual Property</h2>
          <p className="mb-4">
            All game names, logos, trademarks, and copyrights belong to their respective owners. Their use on our website is strictly for informational purposes and does not imply any affiliation with or endorsement by the rights holders.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. DMCA Policy</h2>
          <p className="mb-4">
            We respect the intellectual property rights of others and expect our users to do the same. If you believe that material available on or through our Service infringes upon your copyright, please notify us at contact@gameripple.com.
          </p>
          <p className="mb-4">
            The notification must include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner;</li>
            <li>Identification of the copyrighted work claimed to have been infringed;</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity;</li>
            <li>Information sufficient to permit us to contact the complaining party;</li>
            <li>A statement that the complaining party has a good faith belief that use of the material is not authorized by the copyright owner;</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the copyright owner.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Limitation of Liability</h2>
          <p className="mb-4">
            GameRipple and its operators will not be liable for any loss or damage arising from your use of or inability to use our Service.
          </p>
          <p className="mb-4">
            We are not responsible for the actions, content, information, or data of third parties. To the maximum extent permitted by law, we exclude all representations and warranties relating to our Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our discretion, to modify or replace these terms at any time. If a revision is material, we will try to provide at least 30 days' notice before the new terms take effect.
          </p>
          <p className="mb-4">
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at contact@gameripple.com.
          </p>
        </div>
      </div>
    </div>
  )
}
