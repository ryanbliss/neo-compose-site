import { CodeShowcase } from "@/components/CodeShowcase";
import { DialogueDemo } from "@/components/DialogueDemo";
import { FeatureBento } from "@/components/FeatureBento";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LiveSync } from "@/components/LiveSync";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { SchemaSync } from "@/components/SchemaSync";
import { Security } from "@/components/Security";
import { WikiDemo } from "@/components/WikiDemo";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Marquee />
      <FeatureBento />
      <DialogueDemo />
      <CodeShowcase />
      <SchemaSync />
      <LiveSync />
      <WikiDemo />
      <Security />
      <Footer />
    </main>
  );
}
