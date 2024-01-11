import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './index.css'
import MenuChildrent from './MenuChildrent';


const MenuParent = ({groupName, iconGroup, options}) => {
  return (
    <div className='my-1 w-full cursor-pointer'>
       <Accordion sx={{backgroundColor: 'rgb(15 23 42 / var(--tw-bg-opacity))',  boxShadow: '0'}} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
        //   aria-controls="panel1a-content"
        //   id="panel1a-header"
        sx={{padding: '0px 0', margin: '0 0', minHeight: "auto"}}
        >
        <div className='flex space-x-2 items-end'>
            {iconGroup}
            <Typography sx={{color: "#ccc"}}>{groupName}</Typography>
        </div>
        </AccordionSummary>
        <AccordionDetails sx={{padding: "0 0", margin: "0"}}>
          {options?.length > 0 && options.map(option => 
            <MenuChildrent option={option} key={option.name}/>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default MenuParent
