@echo off
echo Installing dependencies to fix TypeScript errors...
npm install --save-dev @types/node @types/react @types/react-dom typescript
npm install next-themes @supabase/auth-helpers-nextjs @supabase/supabase-js lucide-react
echo Dependencies installed successfully!
