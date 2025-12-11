import Footer from "./Footer"
import Header from "./Header"

const Main = ({ children }) => {
  return (
    <>
      <Header />
        <main className="mt-20 py-10 w-full justify-center gap-8 max-w-7xl flex flex-col px-3 flex-1 items-center">{children}</main>
      <Footer />
    </>
  )
}

export default Main