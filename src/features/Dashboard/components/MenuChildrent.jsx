import { Typography } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'

const MenuChildrent = ({ option }) => {
  return (
    <NavLink to={option.link}>
      <div className='pl-4 py-2 flex space-x-2 items-end w-full hover:bg-slate-600 rounded-md transition duration-300'>
        {option.icon}
        <Typography sx={{ color: "white", fontSize: "14px" }}>
          {option.name}
        </Typography>
      </div>
    </NavLink>
  )
}

export default MenuChildrent
