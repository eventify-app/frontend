import Hero from "../components/Hero"
import PopularEvents from "../components/PopularEvents"
import SignupCTA from "../components/SignupCTA"
import Main from "../layouts/Main"

const Home = () => {
  return (
    <Main>
      <Hero />
      <PopularEvents />
      <SignupCTA />
    </Main>
  )
}

export default Home
