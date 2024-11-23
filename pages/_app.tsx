import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/components/team-creation.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div suppressHydrationWarning>
      <Component {...pageProps} />
    </div>
  )
} 