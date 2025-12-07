# VaultGuard Frontend

A beautiful, modern, and fully responsive frontend for the VaultGuard decentralized bug bounty platform built with Next.js 15, React 19, TypeScript, and TailwindCSS.

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism** design with beautiful gradients
- **Dark mode** support with seamless theme switching
- **Smooth animations** using Framer Motion
- **Micro-interactions** for enhanced user experience
- **Fully responsive** design optimized for all devices

### 🔧 Technical Excellence
- **Type-safe** with TypeScript interfaces and enums
- **Custom hooks** for contract interactions
- **Error boundaries** for graceful error handling
- **Loading states** with beautiful skeleton screens
- **Form validation** with instant feedback
- **Code splitting** and optimized bundle size

### 👤 User Roles

#### 1. **Protocol Owners**
- Create bug bounty vaults with custom payout tiers
- Set judges and required approvals
- Deposit additional funds
- Close vaults and withdraw remaining funds
- Track all submissions to their vaults

#### 2. **Security Researchers**
- Browse active vaults
- Submit vulnerability reports via IPFS
- Track submission status in real-time
- Claim approved payouts
- View earning history

#### 3. **Judges**
- Review pending submissions
- Vote to approve or reject reports
- Filter submissions by status and severity
- Access detailed submission information

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js 15 app directory
│   ├── create/                   # Create vault page
│   ├── dashboard/                # Researcher dashboard
│   ├── judge/                    # Judge portal
│   ├── submit/                   # Submit vulnerability page
│   ├── vaults/                   # Vaults listing
│   │   └── [id]/                 # Individual vault details
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── error-boundary.tsx        # Error boundary component
│   ├── navbar.tsx                # Navigation bar
│   ├── skeletons.tsx             # Loading skeletons
│   ├── states.tsx                # Empty/Error/Success states
│   ├── hero.tsx                  # Hero section
│   ├── features.tsx              # Features section
│   ├── stats.tsx                 # Stats section
│   └── ...                       # Other components
├── hooks/                        # Custom React hooks
│   ├── useVaultGuard.ts          # Contract interaction hook
│   ├── useVaults.ts              # Vaults data hook
│   └── useSubmissions.ts         # Submissions data hook
├── lib/                          # Utility libraries
│   ├── contract.ts               # Contract ABI and address
│   ├── types.ts                  # TypeScript type definitions
│   ├── utils.ts                  # Utility functions
│   └── wagmi.tsx                 # Wagmi configuration
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (recommended) or npm
- MetaMask or another Web3 wallet

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Technology Stack

### Core
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS

### Web3
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **Ethers.js** - Ethereum interaction
- **Reown AppKit** - Wallet connection

### UI/UX
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with animated gradients
- Feature highlights
- Platform statistics
- Call-to-action buttons

### Vaults (`/vaults`)
- Grid view of all vaults
- Filter by status (Active/Closed)
- Real-time vault data
- Quick navigation to vault details

### Vault Details (`/vaults/[id]`)
- Comprehensive vault information
- List of submissions
- Judge information
- Submission filters
- Quick submit button

### Create Vault (`/create`)
- Form with validation
- Dynamic judge management
- Payout percentage configuration
- Real-time error feedback
- Transaction status updates

### Submit Vulnerability (`/submit`)
- Vault selection dropdown
- IPFS hash input
- Severity level selector
- Form validation
- Privacy-first design

### Dashboard (`/dashboard`)
- Researcher submission history
- Earnings statistics
- Quick claim functionality
- Status filtering
- Detailed submission cards

### Judge Portal (`/judge`)
- All pending submissions
- Approve/reject voting
- Filter by status and severity
- Judge statistics
- Detailed submission review

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (600-700)
- **Secondary**: Purple (600-700)
- **Accent**: Pink (600-700)
- **Success**: Green (600-700)
- **Warning**: Orange (600-700)
- **Error**: Red (600-700)

### Typography
- **Font Family**: Geist Sans
- **Headings**: Bold, gradient text
- **Body**: Regular, slate colors
- **Code**: Mono font

### Animations
- **Page transitions**: Fade + slide
- **Hover effects**: Scale + color shift
- **Loading states**: Pulse animations
- **Micro-interactions**: Spring physics

## 🔐 Security Features

- **Type-safe** contract interactions
- **Transaction confirmation** before execution
- **Error handling** at all levels
- **Input validation** on all forms
- **Privacy-first** IPFS integration
- **Address validation** for Ethereum addresses

## 📊 State Management

### Custom Hooks
- `useVaultGuard` - Contract write operations
- `useVaults` - Fetch vault data
- `useVault` - Fetch single vault with details
- `useSubmissions` - Fetch multiple submissions
- `useUserSubmissions` - Fetch current user's submissions

### Local State
- Form data with validation
- Loading states
- Error messages
- Filter selections

### Global State
- Wallet connection (Wagmi)
- Theme preference (next-themes)
- Toast notifications (Sonner)

## 🎯 Performance Optimizations

- **Code splitting** via Next.js App Router
- **Image optimization** with Next.js Image
- **Dynamic imports** for heavy components
- **Memoized hooks** to prevent unnecessary re-renders
- **Optimistic updates** for better UX
- **Skeleton screens** for perceived performance

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Radix UI for accessible primitives
- Wagmi team for excellent Web3 React hooks
- Framer Motion for smooth animations

---

**Built with ❤️ for the Web3 security ecosystem**
