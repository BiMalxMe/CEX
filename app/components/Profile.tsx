"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PrimaryButton, TabButton } from "./Button";
import { useEffect, useState } from "react";
import { tokenbalanceprops, useTokens } from "../api/hooks/useTokens";
import { TokenLists } from "./TokenLists";
import { Swap } from "./Swap";

type Tab = "tokens" | "swap" | "send" | "withdraw" | "add_funds";
const tabs: Tab[] = ["tokens", "swap", "send", "withdraw", "add_funds"];

export default function Profile({ publicKey }: { publicKey?: string }) {
  const { tokenBalances, loading } = useTokens(publicKey ?? "");
  const [selectedTab, setSeclectedTab] = useState<Tab>("tokens");
  const router = useRouter();
  const session = useSession();

  // Redirect if no user
  if (session.status === "unauthenticated") {
    router.push("/");
    return null;
  }

  // Loading state for session
  if (session.status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  // If no balances yet, return safely
  if (!tokenBalances) {
    return null;
  }

  return (
    <div className="pt-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 ">
        <Greeting
          name={session?.data?.user?.name ?? ""}
          imageurl={session?.data?.user?.image ?? ""}
        />
        <div className="w-full flex">
          {tabs.map((tab) => (
            <TabButton
              onClick={() => setSeclectedTab(tab)}
              active={selectedTab === tab}
              key={tab}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace("_", " ")}
            </TabButton>
          ))}
        </div>
        {selectedTab === "tokens" && (
          <Assets
            publicKey={publicKey}
            loading={loading}
            tokenBalances={tokenBalances}
          />
        )}
        {selectedTab === "swap" && <Swap tokenBalances={tokenBalances} publicKey={publicKey}/>}
      </div>
    </div>
  );
}

function Greeting({ name, imageurl }: { name?: string; imageurl?: string }) {
  return (
    <div className="flex items-center">
      {imageurl ? (
        <Image
          src={imageurl}
          alt="User"
          width={48}
          height={48}
          className="rounded-full border object-cover w-16 h-16 "
        />
      ) : (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/2048px-Anonymous_emblem.svg.png"
          alt="User"
          width={48}
          height={48}
          className="rounded-full border object-cover"
        />
      )}
      <div className="ml-4 text-2xl font-semibold">
        Hello, {name || "Guest"}!
      </div>
    </div>
  );
}

function Assets({
  publicKey,
  loading,
  tokenBalances,
}: {
  publicKey?: string;
  loading?: boolean;
  tokenBalances: {
    totalBalance: number;
    tokens: tokenbalanceprops[];
  } | null;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log("Copied to clipboard:", text))
      .catch((err) => console.error("Failed to copy text:", err));
  };

  useEffect(() => {
    if (copied) {
      copyToClipboard(publicKey ?? "");
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied, publicKey]);

  if (loading || !tokenBalances) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-lg font-medium text-gray-600">Loading assets...</p>
      </div>
    );
  }

  return (
    <div className="text-slate-400 mt-4">
      Account Assets
      <br />

      <div className="flex justify-between pt-2">
        <div className="flex">
          <div className="text-4xl font-bold text-black">
            ${Number(tokenBalances.totalBalance).toFixed(2)}
          </div>
          <div className="flex flex-col justify-end text-slate-500 font-bold text-2xl pb-2.5 pl-2">
            USD
          </div>
        </div>
        <div>
          <PrimaryButton onClick={() => setCopied(true)}>
            {copied ? "Copied!" : "Your wallet address"}
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-6">
        <TokenLists tokens={tokenBalances.tokens || []} />
      </div>
    </div>
  );
}
