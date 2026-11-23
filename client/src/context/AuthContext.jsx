import {createContext,useContext,useEffect,useState} from "react";
import {onAuthStateChanged,signOut} from "firebase/auth";
import {doc,onSnapshot} from "firebase/firestore";
import {auth,db} from "../firebase";
const Context=createContext(null);
export const useAuth=()=>useContext(Context);
export function AuthProvider({children}){
 const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true),[profileError,setProfileError]=useState("");
 useEffect(()=>{let stop=()=>{};const unsub=onAuthStateChanged(auth,u=>{stop();setUser(u);setProfile(null);setProfileError("");if(u){stop=onSnapshot(doc(db,"users",u.uid),s=>{setProfile(s.exists()?s.data():null);setLoading(false)},e=>{setProfileError(e.message);setLoading(false)})}else setLoading(false)});return()=>{stop();unsub()}},[]);
 return <Context.Provider value={{user,profile,loading,profileError,logout:()=>signOut(auth)}}>{children}</Context.Provider>
}