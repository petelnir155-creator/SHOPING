import ShoppingApp from './ShoppingApp'
import SetupNotice from './components/SetupNotice'
import { isSupabaseConfigured } from './lib/supabase'

export default function App() {
  return isSupabaseConfigured ? <ShoppingApp /> : <SetupNotice />
}
