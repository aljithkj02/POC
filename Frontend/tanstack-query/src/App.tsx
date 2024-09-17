import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react';
import './App.css'
import { BackupProducts } from './components/BackupProducts';

const url = 'https://dummyjson.com/products';

function App() {
  const [isFetch, setIsFetch] = useState(false);

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get(`${url}?skip=${0}&limit=${20}`);
      return res.data.products;
    },
    refetchOnWindowFocus: false,
    enabled: isFetch,
    retry: 10,
    retryDelay: 300,
  })

  if (isError) {
    console.log("ERROR");
  }

  if (isLoading) {
    return <h2>Loading...</h2>
  }
  
  return (
    <div>
      <button onClick={() => setIsFetch(true)}>Fetch Products</button>
      <p>My new App</p>

      {/* <div style={{ width: '90%', margin: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px'}}>
        {
          data.map((item: any) => {
            return (
              <div key={item.id}
                style={{ background: '#F0F0F0', padding: '10px 20px', borderRadius: '10px', 
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', cursor: 'pointer'
                }}
              >
                <h5>{item.id}</h5>
                <p>{item.title}</p>
              </div>
            )
          })
        }
      </div> */}
      <BackupProducts />
    </div>
  )
}

export default App
