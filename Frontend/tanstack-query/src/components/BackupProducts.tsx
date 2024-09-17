import { useQueryClient } from "@tanstack/react-query"

export const BackupProducts = () => {
    const query = useQueryClient();

    const data: Record<string, string>[] | undefined = query.getQueryData(['products']);

    return (
        <div style={{ width: '90%', margin: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px'}}>
          {
            data?.map((item: any) => {
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
        </div> 
    )
}
