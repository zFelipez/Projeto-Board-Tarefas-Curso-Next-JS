import "../../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    //colocando header assim vai parecer em todas as paginas :
  <> 
   <Header/>  
  <Component {...pageProps} />
  
  </>);
  
  
  
}
