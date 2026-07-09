import { createClient } from "@/lib/client";

const supabase = createClient();

export default function Auth() {
  async function login(provider: "github" | "google") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });

    if(error){
        alert("Some Error is there in this");
    }else{
        alert("SingedIn");
    }
  }


  return (
    <div>
      <button onClick={()=> login('google')}>Login with Google</button>
      <button onClick={() => login('github')}>Login with Github</button>
    </div>
  );
}
