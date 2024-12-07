import Image from "next/image";
import Navbar from "./LandingPageNav";

export default function HeroSection() {
  return (
    <div className="relative min-h-[300vh]" style={{ background: `var(--background)` }}>
      {/* First Section (Full height hero) */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              linear-gradient(to bottom, var(--background) 0%, var(--background-secondary) 100%),
              radial-gradient(circle at center, var(--highlight) 0%, transparent 70%)
            `,
            backgroundBlendMode: "soft-light"
          }}
        ></div>

        {/* Hero Text */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-xl">
          <h1 
            className="text-3xl md:text-5xl font-semibold mb-4"
            style={{color: 'var(--primary-text)'}}
          >
            Your Path to a Healthier Lifestyle
          </h1>
          <p
            className="text-base md:text-lg mb-12"
            style={{color: 'var(--secondary-text)'}}
          >
            Track your progress, enjoy personalized workouts, and achieve your fitness goals—anytime, anywhere.
          </p>
        </div>

        {/* App Images Container */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* Desktop Image */}
            <div className="relative">
              <Image
                src="/desktop.png"
                alt="Desktop App Preview"
                width={1600}
                height={1200}
                className="w-[70vw] max-w-[900px] rounded-lg shadow-2xl"
              />
            </div>

            {/* Mobile Image */}
            <div className="relative">
              <Image
                src="/mobile.png"
                alt="Mobile App Preview"
                width={500}
                height={1000}
                className="w-[30vw] max-w-[250px] rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION: Sticky Navbar with Scrolling Content */}
      <section
        className="sticky top-0 h-screen flex flex-col text-center"
        style={{
          background: `linear-gradient(to top, var(--background-secondary), var(--background))`,
          color: `var(--primary-text)`
        }}
      >
        {/* Navbar pinned at the top of the section */}
        <div className="sticky top-0 z-10 bg-transparent">
          <Navbar />
        </div>

        {/* Scrollable content area inside the sticky section */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto py-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-base md:text-lg mb-8" style={{color: 'var(--secondary-text)'}}>
              Start your fitness journey today with tailored workouts and seamless tracking.
            </p>
            <a
              href="#cta"
              className="inline-block px-8 py-4 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: 'var(--highlight)',
                color: '#FFFFFF',
              }}
            >
              Join Now
            </a>

            {/* Add more content here to enable scrolling within this section */}
            <div className="mt-16 text-left space-y-6" style={{color: 'var(--primary-text)'}}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p>Etiam vehicula, sapien a eleifend aliquet, justo nunc mattis ante, in luctus sapien nisl eu odio.</p>
              <p>Morbi dapibus nisl quis sapien convallis, a blandit lorem ornare.</p>
              <p>Cras sit amet risus non justo ornare convallis et sed metus.</p>
              <p>Vestibulum vehicula semper lectus, non tristique nibh efficitur a. Cras ac aliquam elit.</p>
              <p>Fusce vehicula dui vel metus efficitur, nec hendrerit quam ultrices.</p>
              {/* Add even more content if you like, to simulate scrolling */}
            </div>
          </div>
        </div>
      </section>

      {/* NEXT SECTION (After the sticky section) */}
      <section className="h-screen flex items-center justify-center" style={{ background: `var(--background-secondary)` }}>
        <h2 className="text-3xl md:text-4xl font-semibold" style={{color: 'var(--primary-text)'}}>
          The Next Section After Scrolling
        </h2>
      </section>
    </div>
  );
}