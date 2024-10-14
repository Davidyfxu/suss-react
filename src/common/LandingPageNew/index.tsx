import Hero from './components/hero-home';
import BusinessCategories from './components/business-categories';
import FeaturesPlanet from './components/features-planet';
import LargeTestimonial from './components/large-testimonial';
import Cta from './components/cta';
import { useEffect } from 'react';
import AOS from 'aos';
import Header from './components/ui/header.tsx';
import Footer from './components/ui/footer.tsx';

const Home = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic'
    });
  });
  return (
    <>
      <Header />

      <main className={'grow'}>
        <Hero />
        <BusinessCategories />
        <FeaturesPlanet />
        <LargeTestimonial />
        <Cta />
      </main>
      <Footer border={true} />
    </>
  );
};

export default Home;
