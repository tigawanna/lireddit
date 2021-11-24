import { useMutation,useQuery ,gql} from 'urql';


function Test() {

const TEST = gql`
mutation createpost($title: String!){
  createPost(title: $title) {
    title
  }
}
`;

const[{error,data},dofetch]=useMutation(TEST)
console.log(data)

if (error) return <p>Oh no... {error.message}</p>;
 
    
  return (
 <div>
     <button
     onClick={()=>dofetch({title:"sliding upwards"})}
     >fetch</button>
 </div>     
  )

}

export default Test