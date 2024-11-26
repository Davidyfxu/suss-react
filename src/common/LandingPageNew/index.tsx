import Hero from './components/hero-home';
import NewsAndEvents from './components/business-categories';
import FeaturesPlanet from './components/features-planet';
import Testimonials from './components/testimonials';
import Statistics from './components/statistics';
import Header from './components/ui/header.tsx';
import Footer from './components/ui/footer.tsx';

const Home = () => {
  return (
    <>
      <Header />
      <main className="grow">
        <Hero />
        <Statistics />
        <FeaturesPlanet />
        <NewsAndEvents />
        <Testimonials />
      </main>
      <Footer border={true} />
    </>
  );
};

export default Home;
