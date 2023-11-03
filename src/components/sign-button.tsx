"use client";

import { useRouter } from "next/navigation";
import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";

import { Button } from "@/components/ui/button";

export function SignButton() {
  const router = useRouter();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const onSignMessage = async () => {
    try {
      const callbackUrl = "/protected";
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });

      router.refresh();
    } catch (error) {
      window.alert(error);
    }
  };

  return <Button onClick={onSignMessage}>Sign</Button>;
}
