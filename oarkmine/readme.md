# Starkmine 


## Features

### Core Functionality

- Automated Token Swapping: subscription-based system for automated conversion of assets
- Multi-Route Support: flexible routing options for complex token swaps
- Real-time Event Tracking: comprehensive event logging for swaps and subscriptions

### Technical Features

- Upgradeable Architecture: leverages OpenZeppelin's upgradeable contract 
- Custom Route Configuration: built-in support for multi-token swap routes

## Architecture

AutoSwappr is built on Starknet and implements:

    - Selling Gold NFTs
    - Minting Gold NFTs
    - Escrowing Gold NFTs
    - Voting on Gold NFTs

## Getting Started

## Prerequisites

To set up and run the project locally, ensure you have [the following installed](https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html#install-rust-version--1801):

- [**Starknet Foundry**](https://foundry-rs.github.io/starknet-foundry/index.html)
- [**Scarb**](https://docs.swmansion.com/scarb/download.html)
- [**ASDF Version Manager**](https://asdf-vm.com/guide/getting-started.html)

## Installation

1. **Fork the Repository**

2. **Clone the Repository to your local machine**

```bash
   git clone https://github.com/BlockheaderWeb3-Community/auto-swap
   cd auto-swap
```

3. **Set Up Development Environment**
   To set up development environment:

```bash
    # Configure Scarb version
    asdf local scarb 2.9.2

    # Configure StarkNet Foundry
   asdf local starknet-foundry 0.31.0
```


4. Build the Project:

```bash
   scarb build
```

## Development

### Building

The project uses Scarb as its build tool. To build the contracts:

```bash
scarb build
```

## Testing

Before running the tests,
1. Ensure the `RPC_URL` environment variable is set locally in your shell:
```bash
export RPC_URL=https://starknet-mainnet.public.blastapi.io/rpc/v0_7
```

2. Then save and reload your shell:
```bash
source ~/.zshrc
```

3. After setting the variable, verify it in your shell; this should output your rpc url in your terminal:
```bash
echo $RPC_URL
```

4. Proceed to run snforge test:
```bash
snforge test
```


## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (git checkout -b revoke-allowance)
3. Commit your changes (git commit -m 'test: revoke allowance')
4. Run `bash test_local.sh` to ensure you have a consistent environment with our workflow actions; (Please make you have successfully set `RPC_URL` with this command - `export RPC_URL=https://starknet-mainnet.public.blastapi.io/rpc/v0_7`). All tests must pass locally before proceeding to the next action
5. Push to the branch (git push origin revoke-allowance)
6. Open a Pull Request



## Pull Request Process

1. Ensure your branch is up to date with main
2. Include relevant test cases
3. Update documentation as needed
4. Provide a detailed description of changes
5. Request review from maintainers

## Support

For support and queries:

- Open an issue in the GitHub repository
- Join our [Telegram channel](https://t.me/)

---

Built with ❤️ by the Starmine Community
