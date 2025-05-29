# GameRepackHub

GameRepackHub is a modern web platform designed to provide gamers with easy access to pre-installed, compressed PC game downloads. The platform offers a curated library of games with multiple download options (direct links and torrents), detailed game information, and user-friendly navigation.

## Features

- **Game Library Browser**: Filterable/sortable game grid by genre, release date, and size
- **Search with Autocomplete**: Quickly find your favorite games
- **Detailed Game Pages**: System requirements, screenshots/videos, download options, user ratings/comments
- **Download Management**: Multiple mirror options and download tracking
- **User System**: Favorite games collection, download history, and commenting system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend Framework**: React + Next.js (App Router) for SSR/SSG capabilities
- **TypeScript**: For type safety
- **UI Library**: Tailwind CSS for utility-first styling
- **Backend (BaaS)**: Supabase for PostgreSQL database, authentication, and storage
- **Deployment**: Vercel for seamless Next.js deployment

## Getting Started

### Prerequisites

- Node.js v18+
- Supabase account
- Vercel account (optional for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/gamerepackhub.git
   cd gamerepackhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
GameRepackHub/
├── app/                    # Next.js App Router
│   ├── (main)/             # Main pages
│   ├── games/[slug]/       # Dynamic game pages
│   ├── browse/             # Browse games page
│   ├── login/              # Authentication pages
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # UI components
│   ├── game-grid.tsx       # Game grid component
│   ├── featured-games.tsx  # Featured games component
│   └── ...                 # Other components
├── public/                 # Static assets
│   └── images/             # Images for the application
└── ...                     # Configuration files
```

## Development

### Adding New Games

To add new games to the platform, you'll need to update the game data in the Supabase database. Each game should include:

- Title, slug, and description
- Genre, developer, and publisher information
- Release date and version
- System requirements
- Download links
- Screenshots and cover images

### Styling

The application uses Tailwind CSS for styling. Custom styles can be added in the `globals.css` file.

## Deployment

The application can be deployed to Vercel with the following steps:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various game distribution platforms
- Built with Next.js, Tailwind CSS, and Supabase
