import axios from 'axios'
import Context from '../contexts/Context'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans'

const Profile = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)

  const getDeveloperData = () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data: [user] }) => setDeveloper({ ...user }))
      .catch(({ response: { data } }) => {
        console.error(data)
        window.sessionStorage.removeItem('token')
        setDeveloper(null)
        navigate('/')
      })
  }
xuseEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token obtenido:', token ? token.substring(0, 20) + '...' : 'No hay token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/usuarios', {
        headers: { 
          'Authorization': `Bearer ${token}`  
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {

        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchProfile();
}, [navigate]);
  useEffect(getDeveloperData, [])

  return (
    <div className='py-5'>
      <h1>
        Bienvenido <span className='fw-bold'>{getDeveloper?.email}</span>
      </h1>
      <h3>
        {getDeveloper?.rol} en {getDeveloper?.lenguage}
      </h3>
    </div>
  )
}

export default Profile
