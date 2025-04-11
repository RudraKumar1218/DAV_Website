import { Link } from "react-router-dom";
import { useContext, useRef,useState } from "react";
import { Context } from "../context/context";
import './login.css';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";
import db from '../firebase';
import { useNavigate } from "react-router-dom";
import { doc ,getDoc} from "firebase/firestore";
const auth=getAuth();
export default function Login() {
    const [ showPassword, setShowPassword ] = useState(false);
    const userRef=useRef();
    const passwordRef=useRef();
    const {dispatch,isFetching}=useContext(Context);
    const [error,setError]=useState(false);
    const navigate = useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError(false);
        dispatch({type:"LOGIN_START"})
        const email=userRef.current.value;
        const password=passwordRef.current.value;
        try{
          const userCredentials=await signInWithEmailAndPassword(auth,email,password);
          const user=userCredentials.user;
          const userDoc = await getDoc(doc(db, "users", user.email));
          const userData = userDoc.data();
          console.log(userData);
          dispatch({type:"LOGIN_SUCCESS",payload:userData});
          navigate("/");
        }catch(err){
          dispatch({type:"LOGIN_FAILURE"});
          setError(true);
        }
    }
    return (
        <div className="login-main">
          {/* <div className="login-left">
            <img src={Image} alt="" />
          </div> */}
          <div className="login-right">
            <div className="login-right-container">
              {/* <div className="login-logo">
                <img src={Logo} alt="" />
              </div> */}
              <div className="login-center">
                <h2>Welcome back!</h2>
                <p>Please enter your details</p>
                <form onSubmit={handleSubmit}>
                  <input type="email" placeholder="Email" ref={userRef}/>
                  <div className="pass-input-div">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" ref={passwordRef}/>
                    {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />} 
                  </div>
                  <div className="login-center-options">
                    {/* <div className="remember-div">
                      <input type="checkbox" id="remember-checkbox" />
                      <label htmlFor="remember-checkbox">
                        Remember for 30 days
                      </label>
                    </div> */}
                    {/* <a href="#" className="forgot-pass-link">
                      Forgot password?
                    </a> */}
                  </div>
                  <div className="login-center-buttons">
                    <button type="submit" disabled={isFetching}>Log In</button>
                    {/* <button type="button">
                      <img src={GoogleSvg} alt="" />
                      Log In with Google
                    </button> */}
                  </div>
                </form>
                {error && <span style={{color:"red", marginTop:"10px"}}>Wrong Credentials or Email Not Verified!!</span>}
              </div>
    
              {/* <p className="login-bottom-p">
                Don't have an account? <a href="#">Sign Up</a>
              </p> */}
            </div>
          </div>
        </div>
      );
}