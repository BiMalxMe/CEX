import Image from "next/image";
import { tokenbalanceprops } from "../api/hooks/useTokens";

export const TokenLists = ({ tokens }: { tokens: tokenbalanceprops[] }) => {
  return (
    <div className="space-y-3">
      {tokens.map((tok) => (
        <TokenRow key={tok.mint} token={tok} />
      ))}
    </div>
  );
};

function TokenRow({ token }: { token: tokenbalanceprops }) {
  return (
    <div className="flex items-center justify-between rounded-xl p-2 bg-blue-50">
      {/* Left side: image + name + price */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Image
            src={token.image}
            alt={token.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <p className="text-lg font-semibold text-gray-800">{token.name}</p>
        </div>
        <p className="text-sm text-gray-500">Price: ${token.price}</p>
      </div>

      {/* Right side: balances */}
      <div className="text-right">
        <p className="font-semibold text-gray-900">${token.usdBalance}</p>
        <p className="text-sm text-gray-600">
          {token.balance} {token.name}
        </p>
      </div>
    </div>
  );
}
