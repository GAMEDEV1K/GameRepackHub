import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-game-gray rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
              placeholder="Create a password"
            />
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 8 characters long and include a number and special character.
            </p>
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-game-blue focus:ring-game-blue"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I agree to the <Link href="/terms" className="text-game-blue hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-game-blue hover:underline">Privacy Policy</Link>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full bg-game-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-game-gray text-gray-400">Or sign up with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-game-darker text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4373 21.879V14.89H7.89931V12H10.4373V9.797C10.4373 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1913C13.9503 8.562 13.5633 9.333 13.5633 10.124V12H16.3363L15.8933 14.89H13.5633V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
              </svg>
              Facebook
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-game-darker text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4373 21.879V14.89H7.89931V12H10.4373V9.797C10.4373 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1913C13.9503 8.562 13.5633 9.333 13.5633 10.124V12H16.3363L15.8933 14.89H13.5633V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
              </svg>
              Discord
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-game-blue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
