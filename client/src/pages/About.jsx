import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit
            ipsa optio inventore unde, totam tempora dolore magni beatae eos,
            assumenda iure dolorem autem maiores libero aliquam dolor odit
            cumque amet.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam facilis
            aperiam asperiores vitae fuga, odit omnis deleniti voluptatem rem
            illo dicta, inventore recusandae consectetur dolor iusto quam,
            deserunt esse mollitia?
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae,
            voluptate eligendi, placeat nemo nam deserunt nesciunt harum commodi
            ullam distinctio cupiditate, suscipit repudiandae. Blanditiis animi
            magnam, quo nulla ut obcaecati.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>{" "}
        </p>
      </div>  

      <div className='flex flex-col md:flex-row mb-20'>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Efficieny:</b>
          <p>Streamlined Appointment Scheduling that Fits into Your Busy Life</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Convenience:</b>
          <p>Access a Network of Trusted Healthcare Professionals in Your Area</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Personalization:</b>
          <p>Tailored Recommendations and Reminders to Help You Stay On Top of Your Healts</p>
        </div>
      </div>
    </div>
  );
};

export default About;
