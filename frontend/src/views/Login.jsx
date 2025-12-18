import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../contexts/Context';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const initialForm = { email: 'docente@desafiolatam.com', password: '123456' };

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setDeveloper } = useContext(Context);

  const handleUser = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    setError(''); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');


    if (!user.email.trim() || !user.password.trim()) {
      setError('Email y password obligatorias.');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(user.email)) {
      setError('El formato del email no es correcto!');
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando login a:', 'http://localhost:3000/auth/login');
      console.log('Datos:', user);
      
       const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Login exitoso:', data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('token', data.token);
        
      
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setDeveloper(data.user); 
        }
        

        alert('Usuario identificado con éxito 😀.');
        navigate('/perfil');
      } else {
        throw new Error('No se recibió token del servidor');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión');
      alert(`Error: ${error.message} 🙁.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='col-10 col-sm-6 col-md-3 m-auto mt-5'>
      <h1>Iniciar Sesión</h1>
      <hr />
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className='form-group mt-1'>
        <label>Email address</label>
        <input
          value={user.email}
          onChange={handleUser}
          type='email'
          name='email'
          className='form-control'
          placeholder='Enter email'
          disabled={loading}
        />
      </div>
      
      <div className='form-group mt-1'>
        <label>Password</label>
        <input
          value={user.password}
          onChange={handleUser}
          type='password'
          name='password'
          className='form-control'
          placeholder='Password'
          disabled={loading}
        />
      </div>
      
      <button 
        type='submit' 
        className='btn btn-light mt-3'
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      
      {/* Botón de prueba para registro rápido */}
      <button 
        type='button'
        className='btn btn-secondary mt-2 ms-2'
        onClick={() => navigate('/registro')}
      >
        Ir a Registro
      </button>
    </form>
  );
};

export default Login;