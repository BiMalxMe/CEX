import Image from "next/image";
import { Hero } from "./components/HeroSection";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center p-24">
      <Hero />
    </div>
  );
}
