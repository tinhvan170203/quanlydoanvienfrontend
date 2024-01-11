import * as React from 'react';

import Backdrop from '@mui/material/Backdrop';

export default function ModalLoading({open}) {
  
  return (
    <Backdrop
        sx={{ color: '#fff', zIndex: 1301 }}
        open={open}
      >
         <div className='fixed top-0 left-0 right-0 bottom-0 h-[100vh] flex items-center justify-center z-[100000] bg-white opacity-90'>
            <img alt="img" className='' src='/gifloading.GIF'/>
        </div>
       </Backdrop>
  );
}