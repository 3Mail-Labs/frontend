"use client";

import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import "@web3inbox/widget-react/dist/compiled.css";
import { useCallback, useEffect } from "react";
// import { FaBell, FaBellSlash } from "react-icons/fa";
import { useAccount, useSignMessage } from "wagmi";

import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";

const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;
const appDomain = env.NEXT_PUBLIC_APP_DOMAIN as string;

const Home = () => {
  /** Web3Inbox SDK hooks **/
  const isW3iInitialized = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
    isLimited: process.env.NODE_ENV == "production",
  });
  const { account, setAccount, register: registerIdentity, identityKey } = useW3iAccount();
  const { subscribe, unsubscribe, isSubscribed, isSubscribing, isUnsubscribing } =
    useManageSubscription(account);

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });
  const { signMessageAsync } = useSignMessage();

  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync],
  );

  // We need to set the account as soon as the user is connected
  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessage);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessage, registerIdentity, account]);

  useEffect(() => {
    // register even if an identity key exists, to account for stale keys
    handleRegistration();
  }, [handleRegistration]);

  const handleSubscribe = useCallback(async () => {
    if (!identityKey) {
      await handleRegistration();
    }

    await subscribe();
  }, [subscribe, identityKey]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {isSubscribed ? (
          <Button
            // leftIcon={<FaBellSlash />}
            onClick={unsubscribe}
            variant="outline"
            // isDisabled={!isW3iInitialized || !account}
            // colorScheme="red"
            // isLoading={isUnsubscribing}
            // loadingText="Unsubscribing..."
            // rounded="full"
          >
            Unsubscribe
          </Button>
        ) : (
          // <Tooltip
          //   label={!Boolean(address) ? "Connect your wallet first." : "Register your account."}
          //   hidden={Boolean(account)}
          // >
          <Button
            // leftIcon={<FaBell />}
            onClick={handleSubscribe}
            // colorScheme="cyan"
            // rounded="full"
            // variant="outline"
            // w="fit-content"
            // alignSelf="center"
            // isLoading={isSubscribing}
            // loadingText="Subscribing..."
            // isDisabled={!Boolean(address) || !Boolean(account)}
          >
            Subscribe
          </Button>
          // </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Home;
