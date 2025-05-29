"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Heart, Download, Settings, LogOut } from 'lucide-react'
import GameGrid from '@/components/game-grid'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  
  // Mock user data - in a real app, this would come from Supabase Auth
  const userData = {
    id: '123456',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    joined: '2023-01-15'
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-game-gray rounded-lg p-6 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-game-blue rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-white">
                  {userData.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-gray-400 text-sm">Member since {new Date(userData.joined).toLocaleDateString()}</p>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-game-blue text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'favorites' 
                    ? 'bg-game-blue text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Favorites</span>
              </button>
              
              <button
                onClick={() => setActiveTab('downloads')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'downloads' 
                    ? 'bg-game-blue text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Download className="w-5 h-5" />
                <span>Downloads</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-game-blue text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          <div className="bg-game-gray rounded-lg p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-game-blue rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {userData.name.charAt(0)}
                        </span>
                      </div>
                      <button className="bg-game-darker hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className="bg-game-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Favorite Games</h2>
                <GameGrid type="all" limit={6} />
              </div>
            )}
            
            {activeTab === 'downloads' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Download History</h2>
                
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="bg-game-darker rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                          {/* Game thumbnail would go here */}
                        </div>
                        <div>
                          <h3 className="font-medium">Game Title {item}</h3>
                          <p className="text-sm text-gray-400">Downloaded on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button className="bg-game-blue hover:bg-blue-600 text-white p-2 rounded-full transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-game-darker border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
                        />
                      </div>
                      <button className="bg-game-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-400">Receive emails about new games and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-game-blue"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Browser Notifications</p>
                          <p className="text-sm text-gray-400">Show desktop notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-game-blue"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium mb-3 text-red-400">Danger Zone</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
