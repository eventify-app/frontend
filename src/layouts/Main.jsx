import Footer from "./Footer"
import Header from "./Header"

const Main = ({ children }) => {
  return (
    <>
      <Header />
      <main className="mt-24 w-full max-w-6xl justify-center flex flex-col px-3 flex-1 items-center">{children}</main>
      <Footer />
    </>
  )
}

export default Main