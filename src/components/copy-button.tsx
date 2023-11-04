"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const onCopyLink = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (copied) return <CheckIcon className={className} />;

  return <CopyIcon className={className} onClick={onCopyLink} />;
};
