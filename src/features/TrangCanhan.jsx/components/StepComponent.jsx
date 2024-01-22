import React from 'react';
import "../index.css"

const StepComponent = ({ array }) => {
    return (
        <div className="flex space-x-2 px-4 mx-4 pb-4 scrollhide hover:cursor-pointer">
            {array.map((item,index)=> (
                <div key={index} className='step min-w-[364px]' data-aos="fade-left" data-aos-delay={(index + 1)*300} data-aos-once="true">
                    <div className='flex items-center'>
                        <div className='w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center'>
                        </div>
                        <hr className='w-80 border border-black ml-2' />
                    </div>
                    <div className='mt-1'>
                        <h5 className='text-sm italic text-gray-600'>{item.date}</h5>
                        <h4 className='font-bold text-sm'>{item.label}</h4>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StepComponent
