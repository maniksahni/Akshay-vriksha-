import { AdmitOne, BackPage, Column, MobileBar, Tickets } from './components/Back';
import { Clippings } from './components/Clippings';
import { FrontPage, Masthead } from './components/Front';
import { MenuBoard } from './components/MenuBoard';
import { PressPass } from './components/PressPass';
import { Quiz } from './components/Quiz';
import { ReceiptCalc } from './components/Receipt';

/** "The Moneytec Times": a riso-printed zine about your money, one section per page. */
export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-sun focus:px-5 focus:py-3 focus:font-bold">
        Skip to content
      </a>
      <Masthead />
      <main id="main">
        <FrontPage />
        <ReceiptCalc />
        <MenuBoard />
        <Quiz />
        <Clippings />
        <PressPass />
        <Tickets />
        <Column />
        <AdmitOne />
      </main>
      <BackPage />
      <MobileBar />
      <div className="paper-grain" aria-hidden />
    </>
  );
}
