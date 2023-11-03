import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";

import { SignButton } from "@/components/sign-button";
import { Button } from "@/components/ui/button";

import { UserAccountNav } from "../user-account-nav";

// import { WalletDropdown } from "./wallet-dropdown";

export const WalletStatus = () => {
  const { open } = useWeb3Modal();
  const { data: session } = useSession();

  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    if (session) {
      // return <WalletDropdown address={address} />;
      return <UserAccountNav user={session.user} />;
    } else {
      return <SignButton />;
    }
  }

  return <Button onClick={() => open()}>Connect Wallet</Button>;
};
