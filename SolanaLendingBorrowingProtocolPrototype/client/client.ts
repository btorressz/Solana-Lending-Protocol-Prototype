//TODO: EDIT client.ts

import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { SolanaLendingBorrowingProtocolPrototype } from '../target/types/lending_borrowing';
import { SolanaLendingBorrowingProtocolPrototype } from '../target/types/SolanaLendingBorrowingProtocolPrototype';



const { SystemProgram } = web3;

const provider = AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.LendingBorrowing as Program<SolanaLendingBorrowingProtocolPrototype>;

async function initialize(adminKeypair: web3.Keypair) {
  const tx = await program.methods.initialize()
    .accounts({
      payer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([adminKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function lend(lenderKeypair: web3.Keypair, amount: BN, lenderAccount: PublicKey, tokenAccount: PublicKey) {
  const tx = await program.methods.lend(amount)
    .accounts({
      lender: provider.wallet.publicKey,
      lenderAccount,
      tokenAccount,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .signers([lenderKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function borrow(borrowerKeypair: web3.Keypair, amount: BN, collateral: BN, interestRate: number, borrowerAccount: PublicKey, collateralAccount: PublicKey, tokenAccount: PublicKey) {
  const tx = await program.methods.borrow(amount, collateral, interestRate)
    .accounts({
      borrower: provider.wallet.publicKey,
      borrowerAccount,
      collateralAccount,
      tokenAccount,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .signers([borrowerKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function repay(borrowerKeypair: web3.Keypair, amount: BN, borrowerAccount: PublicKey, tokenAccount: PublicKey) {
  const tx = await program.methods.repay(amount)
    .accounts({
      borrower: provider.wallet.publicKey,
      borrowerAccount,
      tokenAccount,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .signers([borrowerKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function liquidate(liquidatorKeypair: web3.Keypair, borrower: PublicKey, minCollateralRatio: BN, penalty: BN, borrowerAccount: PublicKey, collateralAccount: PublicKey, tokenAccount: PublicKey) {
  const tx = await program.methods.liquidate(borrower, minCollateralRatio, penalty)
    .accounts({
      liquidator: provider.wallet.publicKey,
      borrowerAccount,
      collateralAccount,
      tokenAccount,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .signers([liquidatorKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function updateInterestRate(adminKeypair: web3.Keypair, baseRate: number, rateMultiplier: number, interestRateAccount: PublicKey) {
  const tx = await program.methods.updateInterestRate(baseRate, rateMultiplier)
    .accounts({
      admin: provider.wallet.publicKey,
      interestRate: interestRateAccount,
    })
    .signers([adminKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function propose(proposerKeypair: web3.Keypair, proposalAccount: PublicKey) {
  const tx = await program.methods.propose()
    .accounts({
      proposer: provider.wallet.publicKey,
      proposal: proposalAccount,
      systemProgram: SystemProgram.programId,
    })
    .signers([proposerKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function vote(voterKeypair: web3.Keypair, inFavor: boolean, proposalAccount: PublicKey) {
  const tx = await program.methods.vote(inFavor)
    .accounts({
      voter: provider.wallet.publicKey,
      proposal: proposalAccount,
    })
    .signers([voterKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

async function depositToInsuranceFund(adminKeypair: web3.Keypair, amount: BN, insuranceFundAccount: PublicKey) {
  const tx = await program.methods.depositToInsuranceFund(amount)
    .accounts({
      admin: provider.wallet.publicKey,
      insuranceFund: insuranceFundAccount,
    })
    .signers([adminKeypair])
    .rpc();
  
  console.log("Transaction signature:", tx);
}

// Example usage
(async () => {
  // Replace with actual Keypairs and PublicKeys
  const adminKeypair = web3.Keypair.generate();
  const lenderKeypair = web3.Keypair.generate();
  const borrowerKeypair = web3.Keypair.generate();
  const liquidatorKeypair = web3.Keypair.generate();
  const amount = new BN(1000);
  const collateral = new BN(2000);
  const interestRate = 5;
  const minCollateralRatio = new BN(150);
  const penalty = new BN(10);
  const lenderAccount = new PublicKey("..."); // Replace with actual lender account public key
  const borrowerAccount = new PublicKey("...");
  const collateralAccount = new PublicKey("...");
  const tokenAccount = new PublicKey("...");
  const interestRateAccount = new PublicKey("...");
  const proposalAccount = new PublicKey("...");
  const insuranceFundAccount = new PublicKey("...");

  await initialize(adminKeypair);
  await lend(lenderKeypair, amount, lenderAccount, tokenAccount);
  await borrow(borrowerKeypair, amount, collateral, interestRate, borrowerAccount, collateralAccount, tokenAccount);
  await repay(borrowerKeypair, amount, borrowerAccount, tokenAccount);
  await liquidate(liquidatorKeypair, borrowerKeypair.publicKey, minCollateralRatio, penalty, borrowerAccount, collateralAccount, tokenAccount);
  await updateInterestRate(adminKeypair, 3, 2, interestRateAccount);
  await propose(adminKeypair, proposalAccount);
  await vote(adminKeypair, true, proposalAccount);
  await depositToInsuranceFund(adminKeypair, amount, insuranceFundAccount);
})();
