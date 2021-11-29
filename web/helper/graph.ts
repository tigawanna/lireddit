import { useMutation,useQuery ,gql} from 'urql';

const WHOAMI=gql`
query me{
  Me {
    username
    _id
  }
}`

export {WHOAMI}