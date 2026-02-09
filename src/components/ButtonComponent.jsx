import './ButtonComponent.css'
import { useNavigate } from 'react-router-dom'

export default function ButtonComponent({text="11",width='20vw',to='/'}){
    const navigate = useNavigate()
    return(
        <button className='btn' style={{width}} onClick={()=>navigate(to)}>{text}</button>
    )
}