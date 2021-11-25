import { useMutation,useQuery ,gql} from 'urql';

const whoami=gql`
query me{
  Me {
    username
    _id
  }
}`

export {whoami}

