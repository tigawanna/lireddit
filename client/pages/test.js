import { useMutation,useQuery ,gql} from 'urql';


function Test() {

const TEST = gql`
mutation createpost($title: String!){
  createPost(title: $title) {
    title
  }
}
`;

const whoami=gql`
query me{
  Me {
    username
    _id
  }
}`
  const [result, reexecuteQuery] = useQuery({
    query: whoami,
  });

  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  console.log(data)
  
  return (
 <div>
     <button
     onClick={()=>dofetch({title:"sliding upwards"})}
     >fetch</button>


 </div>     
  )

}

export default Test