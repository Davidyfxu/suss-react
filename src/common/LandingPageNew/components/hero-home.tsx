import PageIllustration from '../components/page-illustration';
import { Button } from 'antd';
import sussLogo from '../../../assets/SUSS_LOGO.jpg';

export default function HeroHome() {
  return (
    <section className="relative bg-[#003D7C]">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <div className="mb-8">
              <img src={sussLogo} alt="SUSS Logo" className="mx-auto h-20" />
            </div>
            <h1
              className="mb-4 text-5xl font-extrabold text-white md:text-6xl"
              data-aos="zoom-y-out"
            >
              Singapore University of{' '}
              <span className="bg-gradient-to-r from-[#E31837] to-[#FF9E1B] bg-clip-text text-transparent">
                Social Sciences
              </span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-gray-200"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Empowering Lifelong Learning, Transforming Society through
                Applied Social Sciences
              </p>
              <div
                className="mx-auto max-w-xs space-y-4 sm:flex sm:max-w-none sm:justify-center sm:space-x-4 sm:space-y-0"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-[#E31837] hover:bg-[#FF9E1B] sm:w-auto"
                >
                  Explore Programs
                </Button>
                <Button
                  size="large"
                  className="w-full border-white hover:border-[#FF9E1B] hover:text-[#FF9E1B] sm:w-auto"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
