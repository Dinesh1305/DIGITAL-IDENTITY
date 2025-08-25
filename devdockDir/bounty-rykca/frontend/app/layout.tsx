"use client";

import { WagmiConfig, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig(
  getDefaultConfig({
    appName: 'Open Innovation',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    chains: [sepolia],
  })
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={config.chains}>
          <body>{children}</body>
        </RainbowKitProvider>
      </WagmiConfig>
    </html>
  )
}