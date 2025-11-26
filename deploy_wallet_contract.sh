#!/bin/bash
# Script to deploy the Smart Wallet contract to Stellar testnet

set -e

WASM_FILE="contracts/target/wasm32v1-none/release/smart_wallet_contracts.wasm"
SOURCE_KEY="test-account"
NETWORK="testnet"

echo "🚀 Smart Wallet Contract Deployment"
echo "===================================="
echo ""

# Check if WASM file exists
if [ ! -f "$WASM_FILE" ]; then
    echo "❌ WASM file not found: $WASM_FILE"
    echo "💡 Building contract first..."
    cd contracts
    cargo build --target wasm32v1-none --release
    cd ..
fi

echo "✅ WASM file found: $WASM_FILE"
echo ""

# Get account address
ACCOUNT_ADDRESS=$(soroban keys address $SOURCE_KEY 2>&1)
echo "📋 Account: $SOURCE_KEY"
echo "📋 Address: $ACCOUNT_ADDRESS"
echo ""

# Check if account exists and has funds
echo "🔍 Checking account status..."
ACCOUNT_INFO=$(curl -s "https://horizon-testnet.stellar.org/accounts/$ACCOUNT_ADDRESS" 2>&1 || echo "not_found")

if echo "$ACCOUNT_INFO" | grep -q "not_found\|404"; then
    echo "⚠️  Account not found or not funded"
    echo ""
    echo "💡 Fund your account using one of these methods:"
    echo ""
    echo "1. Using Stellar Friendbot (easiest):"
    echo "   Visit: https://laboratory.stellar.org/?network=testnet#account-creator"
    echo "   Or use: curl \"https://friendbot.stellar.org/?addr=$ACCOUNT_ADDRESS\""
    echo ""
    echo "2. Using Stellar Laboratory:"
    echo "   https://laboratory.stellar.org/?network=testnet"
    echo ""
    echo "3. Using curl:"
    echo "   curl \"https://friendbot.stellar.org/?addr=$ACCOUNT_ADDRESS\""
    echo ""
    read -p "Press Enter after funding your account, or Ctrl+C to cancel..."
    echo ""
fi

# Deploy contract
echo "📦 Deploying contract..."
echo ""

DEPLOY_OUTPUT=$(soroban contract deploy \
  --wasm "$WASM_FILE" \
  --source-account "$SOURCE_KEY" \
  --network "$NETWORK" 2>&1)

if [ $? -eq 0 ]; then
    # Extract contract ID from output
    CONTRACT_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE '[A-Z0-9]{56}' | head -1)
    
    if [ -n "$CONTRACT_ID" ]; then
        echo "✅ Contract deployed successfully!"
        echo ""
        echo "📋 Contract ID: $CONTRACT_ID"
        echo ""
        echo "🔍 Explorer Links:"
        echo "   Stellar Expert: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
        echo "   Stellar Laboratory: https://laboratory.stellar.org/?network=testnet#contract&contractId=$CONTRACT_ID"
        echo ""
        echo "💾 Save this Contract ID for initialization:"
        echo "   export WALLET_CONTRACT_ID=$CONTRACT_ID"
        echo ""
        
        # Save to file
        echo "$CONTRACT_ID" > .wallet_contract_id
        echo "✅ Contract ID saved to .wallet_contract_id"
    else
        echo "⚠️  Deployment may have succeeded, but couldn't extract Contract ID"
        echo "Output: $DEPLOY_OUTPUT"
    fi
else
    echo "❌ Deployment failed:"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

