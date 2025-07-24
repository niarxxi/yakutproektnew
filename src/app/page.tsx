import { Preloader } from "@/src/components/layout/preloader";
import { Header } from "@/src/components/layout/header";
import { Hero } from "@/src/components/sections/hero";
import { About } from "@/src/components/sections/about";
import { News } from "@/src/components/sections/news";
import { Services } from "@/src/components/sections/services";
import { Projects } from "@/src/components/sections/projects";
import { Departments } from "@/src/components/sections/departments";
import { Partners } from "@/src/components/sections/partners";
import { Contacts } from "@/src/components/sections/contacts";
import { Footer } from "@/src/components/layout/footer";
import { BackgroundTransition } from "@/src/components/common/background-transition";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Preloader />
      <BackgroundTransition />
      <Header />
      <Hero />
      <About />
      <News />
      <Services />
      <Projects />
      <Departments />
      <Partners />
      <Contacts />
      <Footer />
    </main>
  );
}
