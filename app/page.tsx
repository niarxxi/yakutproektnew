import { Preloader } from "@/components/preloader"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Departments } from "@/components/departments"
import { Partners } from "@/components/partners"
import { Contacts } from "@/components/contacts"
import { Footer } from "@/components/footer"
import { BackgroundTransition } from "@/components/background-transition"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Preloader />
      <BackgroundTransition />
      <Header />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Departments />
      <Partners />
      <Contacts />
      <Footer />
    </main>
  )
}
