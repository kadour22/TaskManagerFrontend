import React from 'react'
import axiosInstance from "../Auth/api";
import {useParams} from 'react-router-dom'

const MarkAsReadTask = ({id}) => {

  const mar_as_read_task = async () => {
    axiosInstance.post(`task/${id}/`)
  }  

  return (
    <button onClick={mar_as_read_task}>MarkAsReadTask</button>
  )
}

export default MarkAsReadTask