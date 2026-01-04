import  {createClient} from 'https://esm.sh/@supabase/supabase-js'



const supUrl = 'https://akqohiihzqmdkzkahgrh.supabase.co'
const supKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcW9oaWloenFtZGt6a2FoZ3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NjYxNzQsImV4cCI6MjA4MzA0MjE3NH0.mycNbsbErVzFsm_f_plUTeKzJq3LvC_47PDm6NukRDI'

//intialize
const client = createClient(supUrl,supKey)

console.log(client);

export default client;