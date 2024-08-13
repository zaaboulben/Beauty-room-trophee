"use client"

import React, { useEffect } from "react";


const HtmlText = () => {
  //make a  function for making the text appear on the screen
const [visible, setVisible] = React.useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    setVisible(true);
    console.log("visible", visible);
  }, 2500);

  // Nettoyer le timer lorsqu'il n'est plus nécessaire
  return () => clearTimeout(timer);
}, [visible]);
  
  return (
 


     <div className={` ${visible ? "visible     " : "hidden"} absolute z-50 inset-0 flex flex-col items-center justify-center   text-white w-full h-full p-4 sm:p-10 md:p-20 `}> 
      <div className="p-4 border border-gray-500  w-full h-full inline-flex ">
        <div className="h-full w-1/2 pt-20 pb-20 pl-14" >
        <div className=" flex-col flex gap-5 pb-16">
        <h1 className="text-lg sm:text-xl md:text-4xl font-bold  ">CERTIFICATION  </h1>
        <h1 className="text-lg sm:text-xl md:text-4xl font-normal ">DE REALISATION</h1>
        </div>
        <p className="mt-2 text-xl">Ce certificat atteste que</p>
        <p className="text-xl sm:text-2xl md:text-5xl italic font-thin pt-6 pb-6 ">Loris Garold</p>
        <p className="mt-2 text-xl ">a complété avec succès la formation microshading en ligne</p>
        <div className="pt-28 w-full ">
          <p className="font-bold text-3xl">Formatrice et créatrice</p>
          <p className=" pt-7 text-2xl">Habiba El Medri</p>
        </div>
        <div className="mt-4 w-full ">
          <svg className="w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H3"></path>
          </svg>
        </div>
        </div>
    
        <div className="h-full w-1/2 pt-20 pb-20 pr-14 text-right ">
        <div>

        </div>
          <p className="font-bold text-2xl ">15 JUILLET 2024</p>
        </div>

      </div>
    </div>
  );
};

export default HtmlText;
