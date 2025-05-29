"use client"

import Link from 'next/link'

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-600">
          &larr; Back to home page
        </Link>
      </div>
      
      <div className="bg-game-gray rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Legal Disclaimer</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Content Disclaimer</h2>
          <p className="mb-4">
            GameRipple is an informational platform that provides reviews, news, and information about video games. All materials presented on this site are provided exclusively for informational and educational purposes.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Copyright and Trademarks</h2>
          <p className="mb-4">
            All game names, logos, images, trademarks, and other copyrighted materials presented on this site belong to their respective owners. Their use is strictly for review, criticism, and news reporting purposes, in accordance with fair use principles.
          </p>
          <p className="mb-4">
            GameRipple does not claim any ownership rights to these materials and does not imply any affiliation, sponsorship, or endorsement by the companies or entities mentioned.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">External Links</h2>
          <p className="mb-4">
            Our website may contain links to external sites that are not provided or maintained by us. We exercise no control over the content, privacy policies, or practices of external sites and cannot be held liable for their content.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Our Position Against Piracy</h2>
          <p className="mb-4">
            GameRipple does not support, encourage, or promote piracy or unauthorized distribution of video games or other copyrighted materials. We encourage users to purchase games from legitimate sources and respect the intellectual property rights of creators.
          </p>
          <p className="mb-4">
            Any link or reference to games is provided strictly for informational purposes. Users are responsible for complying with applicable copyright and intellectual property laws in their jurisdiction.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, GameRipple and its operators will not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of or inability to use this site or its content.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">DMCA Notices</h2>
          <p className="mb-4">
            We respect the intellectual property rights of others and expect our users to do the same. If you believe that content on our site infringes your copyright, please contact us at contact@gameripple.com with a detailed notification in accordance with DMCA requirements.
          </p>
          <p className="mb-4">
            We are committed to promptly responding to any legitimate complaints and removing or disabling access to material that is the subject of a valid infringement notice.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Changes to the Disclaimer</h2>
          <p className="mb-4">
            We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting the updated disclaimer on this page.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
          <p className="mb-4">
            For questions or concerns regarding this disclaimer, please contact us at contact@gameripple.com.
          </p>
        </div>
      </div>
    </div>
  )
}
