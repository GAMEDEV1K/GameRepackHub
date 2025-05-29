import Link from 'next/link'
import { HelpCircle, ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const faqs = [
    {
      question: "What is GameRepackHub?",
      answer: "GameRepackHub is a modern web platform designed to provide gamers with easy access to pre-installed, compressed PC game downloads. Our platform offers a curated library of games with multiple download options, detailed game information, and user-friendly navigation."
    },
    {
      question: "Are the games on GameRepackHub free?",
      answer: "Yes, all games on GameRepackHub are free to download. We provide pre-installed game packages that eliminate the need for lengthy installation processes."
    },
    {
      question: "What does 'pre-installed' mean?",
      answer: "Pre-installed games are already installed and configured, so you don't need to go through the installation process. After downloading and extracting the game, you can play it immediately without waiting for installation."
    },
    {
      question: "How do I download games from GameRepackHub?",
      answer: "To download a game, simply browse our collection, select the game you want, and choose from the available download options (direct links or torrents). Follow the instructions provided on the game page for installation."
    },
    {
      question: "Are these games safe to download?",
      answer: "We take security seriously and scan all games for viruses and malware before making them available. However, we recommend using your own antivirus software as an additional precaution. Some antivirus programs may flag game cracks as false positives."
    },
    {
      question: "What are the system requirements for the games?",
      answer: "Each game has its own system requirements, which are listed on the individual game pages. Make sure to check these requirements before downloading to ensure your system can run the game properly."
    },
    {
      question: "Do I need to create an account to download games?",
      answer: "No, you can browse and download games without creating an account. However, creating an account allows you to track your download history, save favorite games, and participate in the community by leaving comments and ratings."
    },
    {
      question: "What is the difference between direct downloads and torrents?",
      answer: "Direct downloads allow you to download the game directly from our servers or mirror sites. Torrents use peer-to-peer technology, which can be faster for popular games but requires a torrent client like qBittorrent or uTorrent."
    },
    {
      question: "Why are the game sizes smaller than the original?",
      answer: "Our games are compressed to reduce download size without compromising quality. We remove unnecessary files, optional languages, and compress game assets to make downloads faster, especially for users with limited bandwidth."
    },
    {
      question: "Can I play multiplayer games downloaded from GameRepackHub?",
      answer: "It depends on the game. Some games support LAN multiplayer or online play through alternative servers. Official multiplayer features that require original game authentication typically won't work with our versions."
    },
    {
      question: "How often do you add new games?",
      answer: "We regularly update our library with new releases and popular titles. You can check the 'New Releases' section to see the latest additions or subscribe to our newsletter to get notified when new games are added."
    },
    {
      question: "What should I do if a game doesn't work?",
      answer: "First, check that your system meets the minimum requirements. Then, review the installation instructions carefully. If you're still having issues, check the comments section for the game or contact us through the 'Contact' page with details about the problem."
    },
    {
      question: "Can I request a specific game?",
      answer: "Yes, you can request games through our 'Request a Game' form. We'll try to add requested games based on popularity and availability, though we can't guarantee all requests will be fulfilled."
    },
    {
      question: "Do you offer games for Mac or Linux?",
      answer: "Currently, we primarily focus on Windows PC games. However, we do have a limited selection of games for Mac and Linux. You can filter games by operating system in the browse section."
    },
    {
      question: "Is GameRepackHub legal?",
      answer: "GameRepackHub is a platform for game distribution. Users are responsible for complying with their local laws regarding copyright and intellectual property. We recommend purchasing games you enjoy to support the developers."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="w-8 h-8 text-game-blue" />
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      </div>
      
      <p className="text-gray-300 mb-8">
        Find answers to common questions about GameRepackHub. If you can't find what you're looking for, feel free to <Link href="/contact" className="text-game-blue hover:underline">contact us</Link>.
      </p>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-game-gray rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex items-center justify-between p-5 cursor-pointer">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="p-5 pt-0 border-t border-gray-700">
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </details>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-game-gray rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-gray-300 mb-4">
          If you couldn't find the answer to your question, please check our troubleshooting guide or contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/troubleshoot" 
            className="bg-game-darker hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            Troubleshooting Guide
          </Link>
          <Link 
            href="/contact" 
            className="bg-game-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
