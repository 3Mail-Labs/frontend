import peanut from "@squirrel-labs/peanut-sdk";
import ethers from "ethers";

interface CreateLinksParams {
  signer: ethers.Signer;
  chainId: number;
  numberOfLinks: number;
  amount: number;
}

export async function createLinks({ signer, chainId, numberOfLinks, amount }: CreateLinksParams) {
  // create link
  const createdLinks = await peanut.createLinks({
    structSigner: {
      signer,
    },
    linkDetails: {
      chainId,
      tokenAmount: amount,
      tokenType: 0, // 0 is for native tokens
      // Values for tokenType are defined in SDK documentation:
      // https://docs.peanut.to/integrations/building-with-the-sdk/sdk-reference/common-types#epeanutlinktype
    },
    numberOfLinks,
  });

  return createdLinks.map((link) => link.link);
}
