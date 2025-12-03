# GuidlVault 🔐

> **A secure vault contract for managing guild/DAO funds** - Built with Solidity and OpenZeppelin for maximum security and flexibility.

GuidlVault is a comprehensive smart contract solution for managing funds in guilds, DAOs, and decentralized organizations. It features role-based access control, multi-signature withdrawal approvals, and support for both native ETH and ERC20 tokens.

---

## ✨ Features

### Core Functionality

- ✅ **Multi-Token Support** - Deposit and withdraw native ETH and ERC20 tokens
- ✅ **Role-Based Access Control** - Admin, Treasurer, and Member roles with granular permissions
- ✅ **Multi-Signature Withdrawals** - Configurable approval threshold for secure fund management
- ✅ **Deposit Tracking** - Track individual member contributions
- ✅ **Withdrawal Requests** - Request-based withdrawal system with approval workflow
- ✅ **Emergency Controls** - Pause functionality and emergency withdrawal for admins

### Security Features

- 🔒 **Reentrancy Protection** - Using OpenZeppelin's ReentrancyGuard
- 🔒 **Access Control** - Role-based permissions using OpenZeppelin's AccessControl
- 🔒 **Pausable** - Ability to pause operations in case of emergencies
- 🔒 **Safe Token Transfers** - Using SafeERC20 for secure token operations
- 🔒 **Input Validation** - Comprehensive checks for all operations

---

## 📋 Contract Overview

### Roles

- **ADMIN_ROLE**: Full control over the vault (pause, configuration, emergency withdrawals)
- **TREASURER_ROLE**: Can create and approve withdrawal requests
- **MEMBER_ROLE**: Can deposit funds into the vault

### Key Functions

#### Deposits

- `depositNative()` - Deposit native ETH (can also use `receive()`)
- `depositToken(address token, uint256 amount)` - Deposit ERC20 tokens

#### Withdrawals

- `createWithdrawalRequest(...)` - Create a withdrawal request (Treasurer only)
- `approveWithdrawalRequest(uint256 requestId)` - Approve a withdrawal request (Treasurer only)
- `emergencyWithdraw(...)` - Direct withdrawal for emergencies (Admin only)

#### Administration

- `setMinDepositAmount(uint256)` - Update minimum deposit
- `setMaxWithdrawalAmount(uint256)` - Update maximum withdrawal per transaction
- `setRequiredApprovals(uint256)` - Update approval threshold
- `addMember(address)` / `removeMember(address)` - Manage members
- `pause()` / `unpause()` - Emergency pause controls

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Hardhat

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Gbangbolaoluwagbemiga/GuidlVault.git
cd GuidlVault
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_sepolia_rpc_url
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
ETHERSCAN_API_KEY=your_etherscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm run test
```

### Deploy

#### Local Network

```bash
npm run deploy:local
```

#### Sepolia Testnet

```bash
npm run deploy:sepolia
```

#### Base Sepolia Testnet

```bash
npm run deploy:base
```

---

## 📖 Usage Examples

### Deploying the Contract

When deploying, you need to provide:

- `_admin`: Address with admin privileges
- `_treasurer`: Address with treasurer privileges
- `_minDeposit`: Minimum deposit amount (in wei)
- `_maxWithdrawal`: Maximum withdrawal per transaction (in wei)
- `_requiredApprovals`: Number of approvals needed for withdrawals

### Depositing Funds

```solidity
// Deposit native ETH
vault.depositNative{value: 1 ether}();

// Deposit ERC20 tokens
vault.depositToken(tokenAddress, amount);
```

### Creating a Withdrawal Request

```solidity
vault.createWithdrawalRequest(
    address(0), // address(0) for native ETH, or token address
    recipientAddress,
    amount,
    "Reason for withdrawal"
);
```

### Approving a Withdrawal Request

```solidity
vault.approveWithdrawalRequest(requestId);
```

---

## 🔐 Security Considerations

- ⚠️ **Never commit** your `.env` file or private keys
- ✅ All withdrawals require multi-signature approval (configurable)
- ✅ Only authorized roles can perform sensitive operations
- ✅ Reentrancy protection on all state-changing functions
- ✅ Pausable for emergency situations
- ✅ Input validation on all functions

---

## 📁 Project Structure

```
GuidlVault/
├── contracts/
│   └── GuidlVault.sol       # Main vault contract
├── scripts/
│   └── deploy.js            # Deployment script
├── test/                    # Test files (to be added)
├── hardhat.config.js        # Hardhat configuration
├── package.json
└── README.md
```

---

## 🌐 Supported Networks

- Ethereum Sepolia (Testnet)
- Base Sepolia (Testnet)
- Base Mainnet
- Local Hardhat Network

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **OpenZeppelin** - For secure, audited smart contract libraries
- **Hardhat** - For the amazing development environment
- **Base** - For the L2 network support

---

## 💡 Future Enhancements

- 📊 Analytics and reporting dashboard
- 🔄 Recurring payment support
- 👥 Multi-vault management
- 🏷️ Tagging and categorization
- 📧 Event notifications
- 🔐 Integration with governance tokens
- ⚡ Gasless transactions (meta-transactions)

---

**Built with ❤️ for the Web3 ecosystem**

_Secure, transparent, and efficient fund management for decentralized organizations._ 🔐

